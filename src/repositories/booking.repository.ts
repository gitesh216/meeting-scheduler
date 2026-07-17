import { getDbClient, type DbClient } from "../config/db-client.js";

export interface CreateBookingData {
    slotId: string;
    inviteeEmail: string;
    inviteeName: string;
    inviteeNotes?: string;
    hostId: number;
    eventTypeId: number;
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
