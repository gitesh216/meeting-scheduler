import { proxyActivities } from "@temporalio/workflow";

import type * as activities from "../activities/index.js";

const { createGoogleCalendarEventActivity, deleteGoogleCalendarEventActivity } =
    proxyActivities<typeof activities>({
        retry: {
            maximumAttempts: 3,
        },
        startToCloseTimeout: "1 minute",
    });

export async function createGoogleCalendarEventWorkflow(bookingId: number) {
    await createGoogleCalendarEventActivity(bookingId);
}

export async function deleteGoogleCalendarEventWorkflow(bookingId: number) {
    await deleteGoogleCalendarEventActivity(bookingId);
}
