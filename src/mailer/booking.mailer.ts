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
