import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/index.js";

const { sendBookingConfirmationEmailAcitivity } = proxyActivities<
    typeof activities
>({
    retry: {
        maximumAttempts: 3,
    },
    startToCloseTimeout: "1 minute",
});

const { sendBookingCancelledEmailActivity } = proxyActivities<
    typeof activities
>({
    retry: {
        maximumAttempts: 3,
    },
    startToCloseTimeout: "1 minute",
});

export async function sendBookingConfirmationWorkflow(bookingId: number) {
    await sendBookingConfirmationEmailAcitivity(bookingId);
}

export async function sendBookingCancelledWorkflow(bookingId: number) {
    await sendBookingCancelledEmailActivity(bookingId);
}
