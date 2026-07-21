import { sendEmail } from "../config/nodemailer.js";
import { findBookingById } from "../repositories/booking.repository.js";

export async function sendBookingConfirmationEmail(bookingId: number) {
    const booking = await findBookingById(bookingId);
    if (!booking || booking.status !== "CONFIRMED") {
        return;
    }

    const when = booking.slot.startAt.toUTCString();

    await sendEmail(
        booking.inviteeEmail,
        `Booking confirmation for ${booking.eventType.title}`,
        `
        <h1>Booking confirmation for ${booking.eventType.title}</h1>
        <p>Hi ${booking.inviteeName},</p>
        <p>You have a booking for ${booking.eventType.title} on ${when}.</p>
    `,
    );
}

export async function sendBookingCancelledEmail(bookingId: number) {
    const booking = await findBookingById(bookingId);
    if (!booking || booking.status !== "CANCELLED") {
        return;
    }

    const when = booking.slot.startAt.toUTCString();

    await sendEmail(
        booking.inviteeEmail,
        `Booking cancelled for ${booking.eventType.title}`,
        `
        <h1>Booking cancelled for ${booking.eventType.title}</h1>
        <p>Hi ${booking.inviteeName},</p>
        <p>Your booking for ${booking.eventType.title} scheduled on ${when} has been cancelled.</p>
        <p>If this was a mistake or you'd like to book another time, please make a new reservation.</p>
    `,
    );
}
