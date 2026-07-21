import { prisma } from "../config/database.js";
import { getDbClient, type DbClient } from "../config/db-client.js";

export interface CreateBookingData {
    slotId: string;
    inviteeEmail: string;
    inviteeName: string;
    inviteeNotes?: string;
    hostId: number;
    eventTypeId: number;
}

export interface ListHostBookingsFilters {
    status?: string;
    from?: Date;
    to?: Date;
}

export async function createBooking(data: CreateBookingData, db?: DbClient) {
    const client = getDbClient(db);

    const booking = client.booking.create({
        data: {
            ...data,
            status: "CONFIRMED",
        },
        include: {
            slot: true,
        },
    });
    return booking;
}

export async function findHostBookings(
    hostId: number,
    filters: ListHostBookingsFilters = {},
) {
    const slotStartAt: { gte?: Date; lte?: Date } = {};

    if (filters.from) {
        slotStartAt.gte = filters.from;
    }

    if (filters.to) {
        slotStartAt.lte = filters.to;
    }

    const bookings = await prisma.booking.findMany({
        where: {
            hostId,
            ...(filters.status && { status: filters.status }),
            ...(Object.keys(slotStartAt).length > 0 && {
                slot: { startAt: slotStartAt },
            }),
        },
        include: {
            slot: true,
            eventType: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
        orderBy: {
            slot: {
                startAt: "asc",
            },
        },
    });
    return bookings;
}

export async function findBookingById(id: number) {
    const booking = await prisma.booking.findUnique({
        where: {
            id,
        },
        include: {
            slot: true,
            eventType: true,
            host: true,
        },
    });
    return booking;
}

export async function findBookingByIdForHost(
    bookingId: number,
    hostId: number,
    db?: DbClient,
) {
    const client = getDbClient(db);
    return client.booking.findFirst({
        where: { id: bookingId, hostId },
        include: { slot: true, eventType: true, host: true },
    });
}

export async function cancelBookingById(
    bookingId: number,
    hostId: number,
    db?: DbClient,
) {
    const client = getDbClient(db);
    const booking = await findBookingById(bookingId);

    if (!booking || booking.hostId !== hostId) {
        return;
    }

    const delBooking = await client.booking.update({
        where: {
            id: bookingId,
            status: {
                in: ["CONFIRMED", "PENDING"],
            },
        },
        data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
        },
        include: {
            slot: true,
            eventType: true,
            host: true,
        },
    });

    return delBooking;
}
