import { prisma } from "../config/database.js";
import {
    CreateBookingDto,
    ListHostBookingsQuery,
} from "../dtos/booking.dto.js";
import { badRequest, notFound } from "../utils/api-error.js";
import type { Slot } from "../../generated/prisma/client.js";
import {
    findSlotById,
    lockSlotForUpdate,
    markSlotBookedIfAvailable,
    markSlotBooked,
} from "../repositories/slot.repository.js";
import {
    createBooking,
    findHostBookings,
} from "../repositories/booking.repository.js";
import { startRegenerateHostSlotsWorkflow } from "../temporal/client.js";
import { DateTime } from "luxon";

async function triggerSlotRegen(hostId: number, slotStartAt: Date) {
    const date = slotStartAt.toISOString().split("T")[0];
    await startRegenerateHostSlotsWorkflow({
        hostId,
        from: date,
        to: date,
    });
    console.log(
        `[booking] Triggering slot regeneration for host ${hostId} on ${date}`,
    );
}

function validateSlotForBooking(slot: Slot | null): Slot {
    if (!slot) {
        throw notFound("Slot not found");
    }
    if (slot.status !== "AVAILABLE") {
        throw badRequest("Slot is not available");
    }

    if (slot.startAt <= new Date()) {
        throw badRequest("Slot has already started");
    }

    return slot;
}

function formatBookingResponse(booking: {
    id: number;
    status: string;
    slot: { startAt: Date; endAt: Date };
}) {
    return {
        booking: {
            id: booking.id,
            status: booking.status,
            startAt: booking.slot.startAt.toISOString(),
            endAt: booking.slot.endAt.toISOString(),
        },
    };
}

export async function createBookingOptimistically(
    userId: number,
    bookingDto: CreateBookingDto,
) {
    const booking = await prisma.$transaction(async (tx) => {
        const slot = validateSlotForBooking(
            await findSlotById(bookingDto.slotId, tx),
        );

        const updated = await markSlotBookedIfAvailable(bookingDto.slotId, tx);

        if (updated.count !== 1) {
            throw badRequest("Slot is not available");
        }

        return createBooking(
            {
                slotId: bookingDto.slotId,
                inviteeEmail: bookingDto.inviteeEmail,
                inviteeName: bookingDto.inviteeName,
                inviteeNotes: bookingDto.inviteeNotes,
                hostId: userId,
                eventTypeId: slot.eventTypeId,
            },
            tx,
        );
    });
    await triggerSlotRegen(userId, booking.slot.startAt);

    return formatBookingResponse(booking);
}

export async function createBookingPessimistically(
    userId: number,
    bookingDto: CreateBookingDto,
) {
    const booking = await prisma.$transaction(async (tx) => {
        const locked = await lockSlotForUpdate(bookingDto.slotId, tx);

        if (locked.length !== 1) {
            throw notFound("Slot is not available");
        }

        const slot = validateSlotForBooking(
            await findSlotById(bookingDto.slotId, tx),
        );

        await markSlotBooked(bookingDto.slotId, tx);

        return createBooking(
            {
                slotId: bookingDto.slotId,
                inviteeEmail: bookingDto.inviteeEmail,
                inviteeName: bookingDto.inviteeName,
                inviteeNotes: bookingDto.inviteeNotes,
                hostId: userId,
                eventTypeId: slot.eventTypeId,
            },
            tx,
        );
    });
    await triggerSlotRegen(userId, booking.slot.startAt);

    return formatBookingResponse(booking);
}

function formatBookingListItem(booking: {
    id: number;
    status: string;
    inviteeEmail: string;
    inviteeName: string;
    inviteeNotes: string | null;
    slot: { startAt: Date; endAt: Date };
    eventType: { id: number; title: string; slug: string };
}) {
    return {
        id: booking.id,
        status: booking.status,
        inviteeEmail: booking.inviteeEmail,
        inviteeName: booking.inviteeName,
        inviteeNotes: booking.inviteeNotes,
        startAt: booking.slot.startAt.toISOString(),
        endAt: booking.slot.endAt.toISOString(),
        eventType: booking.eventType,
    };
}

export async function listHostBookings(
    hostId: number,
    query: ListHostBookingsQuery,
) {
    const from = query.from
        ? DateTime.fromISO(query.from, { zone: "utc" })
              .startOf("day")
              .toJSDate()
        : undefined;

    const to = query.to
        ? DateTime.fromISO(query.to, { zone: "utc" }).endOf("day").toJSDate()
        : undefined;

    const bookings = await findHostBookings(hostId, {
        status: query.status,
        from,
        to,
    });
    return {
        bookings: bookings.map(formatBookingListItem),
    };
}
