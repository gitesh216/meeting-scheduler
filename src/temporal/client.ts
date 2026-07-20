import { TEMPORAL_ENABLED, TEMPORAL_TASK_QUEUE } from "../config/env.js";
import { getTemporalClient } from "../config/temporal.js";
import { RegenerateHostSlotsInput } from "../services/slot.service.js";

async function startWorkflow(
    workflowName: string,
    workflowId: string,
    args: unknown[],
) {
    if (!TEMPORAL_ENABLED) {
        console.warn(
            "[Temporal] Temporal is not enabled, skipping workflow execution",
        );
        return null;
    }

    try {
        const client = await Promise.race([
            getTemporalClient(),
            new Promise<never>((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new Error("Temporal client connection timed out"),
                        ),
                    5000,
                ),
            ),
        ]);

        const handle = await client.workflow.start(workflowName, {
            taskQueue: TEMPORAL_TASK_QUEUE,
            workflowId,
            args,
        });

        return handle.workflowId;
    } catch (error) {
        console.error(
            `[temporal] Error starting workflow: ${workflowName} with id: ${workflowId}, error: ${error}`,
        );
        return null;
    }
}

export async function startRegenerateHostSlotsWorkflow(
    input: RegenerateHostSlotsInput,
) {
    return startWorkflow(
        "regenerateHostSlotsWorkflow",
        `regenerate-host-slots-${input.hostId}-${Date.now()}`,
        [input],
    );
}

export async function startSendBookingConfirmationWorkflow(bookingId: number) {
    return startWorkflow(
        "sendBookingConfirmationWorkflow",
        `send-booking-confirmation-${bookingId}-${Date.now()}`,
        [bookingId],
    );
}
