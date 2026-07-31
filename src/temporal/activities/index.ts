import {
    sendBookingConfirmationEmail,
    sendBookingCancelledEmail,
} from "../../mailer/booking.mailer.js";
import {
    updateBookingCalendarDetails,
    clearBookingCalendarDetails,
} from "../../repositories/booking.repository.js";
import {
    createGoogleCalendarEvent,
    isProjectCalendarConfigured,
    deleteGoogleCalendarEvent,
} from "../../services/google-calendar.service.js";
import {
    RegenerateHostSlotsInput,
    generateHostSlots as runSlotGeneration,
} from "../../services/slot.service.js";

export async function regenerateHostSlotsActivity(
    input: RegenerateHostSlotsInput,
) {
    await runSlotGeneration(input);
}

export async function sendBookingConfirmationEmailAcitivity(bookingId: number) {
    await sendBookingConfirmationEmail(bookingId);
}

export async function sendBookingCancelledEmailActivity(bookingId: number) {
    await sendBookingCancelledEmail(bookingId);
}

export async function createGoogleCalendarEventActivity(bookingId: number) {
    if (!isProjectCalendarConfigured()) {
        console.warn(
            "[temporal] Google Calendar is not configured, skipping event creation",
        );
        return;
    }
    const result = await createGoogleCalendarEvent(bookingId);

    await updateBookingCalendarDetails(bookingId, {
        meetLink: result.meetLink,
        calendarEventId: result.calendarEventId,
    });
}

export async function deleteGoogleCalendarEventActivity(bookingId: number) {
    if (!isProjectCalendarConfigured()) {
        console.warn(
            "[temporal] Google Calendar is not configured, skipping event deletion",
        );
        return;
    }
    await deleteGoogleCalendarEvent(bookingId);
    await clearBookingCalendarDetails(bookingId);
}
