import { prisma } from "../config/database.js";

export async function findBookedSlotsByHostInRange(
    hostId: number,
    startDate: Date,
    endDate: Date,
) {
    const slots = await prisma.slot.findMany({
        where: {
            hostId,
            startAt: {
                gte: startDate,
                lte: endDate,
            },
            status: "BOOKED",
        },
    });
    return slots;
}

export async function upsertAvailableSlot(
    hostId: number,
    eventTypeId: number,
    startAt: Date,
    endAt: Date,
) {
    const slot = await prisma.slot.upsert({
        where: {
            eventTypeId_startAt_endAt: {
                eventTypeId,
                startAt,
                endAt,
            },
        },
        create: {
            hostId,
            eventTypeId,
            startAt,
            endAt,
            status: "AVAILABLE",
        },
        update: {
            status: "AVAILABLE",
        },
    });
    return slot;
}

export async function findFutureSlotsByEventTypeInRange(
    eventTypeId: number,
    startDate: Date,
    endDate: Date,
) {
    const slots = await prisma.slot.findMany({
        where: {
            eventTypeId,
            startAt: {
                gte: startDate,
                lte: endDate,
            },
            status: { in: ["AVAILABLE", "BLOCKED"] },
        },
    });
    return slots;
}

export async function blockSlot(id: string) {
    const slot = await prisma.slot.update({
        where: {
            id,
        },
        data: {
            status: "BLOCKED",
        },
    });
    return slot;
}
