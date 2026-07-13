import { RegenerateHostSlotsInput } from "../../services/slot.service.js";

import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/index.js";

const { regenerateHostSlotsActivity } = proxyActivities<typeof activities>({
    retry: {
        maximumAttempts: 3,
    },
    startToCloseTimeout: "1 minute",
});

export async function regenerateHostSlotsWorkflow(
    input: RegenerateHostSlotsInput,
) {
    await regenerateHostSlotsActivity(input);
}
