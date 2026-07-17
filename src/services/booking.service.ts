import { prisma } from "../config/database.js";
import { CreateBookingDto } from "../dtos/booking.dto.js";
import { badRequest, notFound } from "../utils/api-error.js";
import type { Slot } from "../../generated/prisma/client.js";
import {
    findSlotById,
    lockSlotForUpdate,
    markSlotBookedIfAvailable,
    markSlotBooked,
} from "../repositories/slot.repository.js";
import { createBooking } from "../repositories/booking.repository.js";

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

    return formatBookingResponse(booking);
}
