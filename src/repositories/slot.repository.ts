import { prisma } from "../config/database.js";
import { getDbClient, type DbClient } from "../config/db-client.js";

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

export async function findSlotById(id: string, db?: DbClient) {
    const client = getDbClient(db);

    const slot = await client.slot.findUnique({
        where: {
            id,
        },
    });
    return slot;
}

export async function markSlotBookedIfAvailable(id: string, db?: DbClient) {
    const client = getDbClient(db);

    const bookedSlot = await client.slot.updateMany({
        where: {
            id,
            status: "AVAILABLE",
        },
        data: {
            status: "BOOKED",
        },
    });
    return bookedSlot;
}

export async function lockSlotForUpdate(id: string, db?: DbClient) {
    const client = getDbClient(db);

    const lockedSlot = client.$queryRaw<{ id: string }[]>`
        SELECT id
        FROM slots
        WHERE id = ${id}
        FOR UPDATE
    `;
    return lockedSlot;
}

export async function markSlotBooked(id: string, db?: DbClient) {
    const client = getDbClient(db);

    const bookedSlot = await client.slot.update({
        where: {
            id,
        },
        data: {
            status: "BOOKED",
        },
    });
    return bookedSlot;
}

export async function markSlotAvailable(id: string, db?: DbClient) {
    const client = getDbClient(db);

    const availableSlot = await client.slot.update({
        where: {
            id,
        },
        data: {
            status: "AVAILABLE",
        },
    });
    return availableSlot;
}
