import { notFound, badRequest } from "../utils/api-error.js";
import { DateTime } from "luxon";
import {
    findActiveRulesByUser,
    findExceptionsByUserInRange,
} from "../repositories/availability.repository.js";
import {
    findActiveEventTypesByHost,
    findEventTypesByHost,
} from "../repositories/event-type.repository.js";
import {
    findBookedSlotsByHostInRange,
    bulkCreateAvailableSlots,
    bulkUpdateSlotStatuses,
    findFutureSlotsByEventTypeInRange,
} from "../repositories/slot.repository.js";
import {
    applyExceptionsForDate,
    TimeWindow,
    windowsForWeekDayRule,
    splitIntoSlots,
    overlapsBooked,
} from "../utils/slots/slot-generation.js";
import { getById as getUserById } from "../repositories/user.repository.js";

export interface RegenerateHostSlotsInput {
    hostId: number;
    from?: string; // YYYY-MM-DD
    to?: string; // YYYY-MM-DD
}

export async function generateHostSlots(input: RegenerateHostSlotsInput) {
    const host = await getUserById(input.hostId);
    if (!host) {
        throw notFound("Host not found");
    }

    const from = input.from
        ? DateTime.fromISO(input.from, { zone: "utc" }).startOf("day")
        : DateTime.now().setZone("utc").startOf("day");

    const to = input.to
        ? DateTime.fromISO(input.to, { zone: "utc" }).endOf("day")
        : DateTime.now().setZone("utc").plus({ days: 30 }).endOf("day");

    if (!from.isValid) {
        throw badRequest("Invalid 'from' date");
    }
    if (!to.isValid) {
        throw badRequest("Invalid 'to' date");
    }
    if (to < from) {
        throw badRequest("'to' date must not be before 'from' date");
    }

    const [rules, exceptions, activeEventTypes, allEventTypes, bookedSlots] =
        await Promise.all([
            findActiveRulesByUser(input.hostId),
            findExceptionsByUserInRange(
                input.hostId,
                from.toJSDate(),
                to.toJSDate(),
            ),
            findActiveEventTypesByHost(input.hostId),
            findEventTypesByHost(input.hostId),
            findBookedSlotsByHostInRange(
                input.hostId,
                from.toJSDate(),
                to.toJSDate(),
            ),
        ]);

    const bookedWindows: TimeWindow[] = bookedSlots.map((slot) => ({
        start: DateTime.fromJSDate(slot.startAt, { zone: "utc" }),
        end: DateTime.fromJSDate(slot.endAt, { zone: "utc" }),
    }));

    for (const eventType of activeEventTypes) {
        const generatedValidSlotsKeys = new Set<string>();
        const pendingSlots: { startAt: Date; endAt: Date }[] = [];

        for (
            let cursor = from;
            cursor <= to;
            cursor = cursor.plus({ days: 1 })
        ) {
            const dateKey = cursor.toISODate();

            const dayExceptions = exceptions.filter(
                (ex) =>
                    DateTime.fromJSDate(ex.date, {
                        zone: "utc",
                    }).toISODate() === dateKey,
            );

            const dayExceptionsWithTimeZone = dayExceptions.map((ex) => ({
                type: ex.type,
                startTime: ex.startTime,
                endTime: ex.endTime,
                timeZone: ex.timezone,
            }));

            let windows: TimeWindow[] = [];
            for (const rule of rules) {
                windows.push(
                    ...windowsForWeekDayRule(
                        cursor,
                        rule.weekday,
                        rule.startTime,
                        rule.endTime,
                        rule.timezone,
                    ),
                );
            }

            windows = applyExceptionsForDate(
                cursor,
                windows,
                dayExceptionsWithTimeZone,
            );

            const slots = splitIntoSlots(
                windows,
                eventType.durationMinutes,
                eventType.bufferBeforeMinutes,
                eventType.bufferAfterMinutes,
            ).filter(
                (slot) =>
                    slot.start > DateTime.utc() &&
                    !overlapsBooked(
                        slot,
                        bookedWindows,
                        eventType.bufferBeforeMinutes,
                        eventType.bufferAfterMinutes,
                    ),
            ); // slots filtered to exclude past slots and slots that overlap with booked slots

            for (const slot of slots) {
                const startAt = slot.start.toUTC().toJSDate();
                const endAt = slot.end.toUTC().toJSDate();
                const key = `${eventType.id}|${startAt.toISOString()}|${endAt.toISOString()}`;
                generatedValidSlotsKeys.add(key);
                pendingSlots.push({ startAt, endAt });
            }
        }

        const existingSlots = await findFutureSlotsByEventTypeInRange(
            eventType.id,
            from.toJSDate(),
            to.toJSDate(),
        );

        const existingKeys = new Set(
            existingSlots.map(
                (s) =>
                    `${eventType.id}|${s.startAt.toISOString()}|${s.endAt.toISOString()}`,
            ),
        );

        const slotsToCreate = pendingSlots.filter(
            (s) =>
                !existingKeys.has(
                    `${eventType.id}|${s.startAt.toISOString()}|${s.endAt.toISOString()}`,
                ),
        );

        const idsToReactivate: string[] = [];
        const idsToBlock: string[] = [];

        for (const slot of existingSlots) {
            const key = `${eventType.id}|${slot.startAt.toISOString()}|${slot.endAt.toISOString()}`;

            if (
                generatedValidSlotsKeys.has(key) &&
                slot.status !== "AVAILABLE"
            ) {
                idsToReactivate.push(slot.id);
            } else if (
                !generatedValidSlotsKeys.has(key) &&
                slot.status === "AVAILABLE"
            ) {
                idsToBlock.push(slot.id);
            }
        }

        if (slotsToCreate.length > 0) {
            await bulkCreateAvailableSlots(
                input.hostId,
                eventType.id,
                slotsToCreate,
            );
        }
        if (idsToReactivate.length > 0) {
            await bulkUpdateSlotStatuses(idsToReactivate, "AVAILABLE");
        }
        if (idsToBlock.length > 0) {
            await bulkUpdateSlotStatuses(idsToBlock, "BLOCKED");
        }
    }

    const inactiveEventTypeIds = allEventTypes
        .filter((et) => !et.isActive)
        .map((et) => et.id);

    if (inactiveEventTypeIds.length > 0) {
        const inactiveSlotBatches = await Promise.all(
            inactiveEventTypeIds.map((id) =>
                findFutureSlotsByEventTypeInRange(
                    id,
                    from.toJSDate(),
                    to.toJSDate(),
                ),
            ),
        );

        const idsToBlock = inactiveSlotBatches
            .flat()
            .filter((s) => s.status !== "BLOCKED")
            .map((s) => s.id);

        if (idsToBlock.length > 0) {
            await bulkUpdateSlotStatuses(idsToBlock, "BLOCKED");
        }
    }
}
