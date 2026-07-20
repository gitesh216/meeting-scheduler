import { sendBookingConfirmationEmail } from "../../mailer/booking.mailer.js";
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
