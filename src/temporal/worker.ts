import { NativeConnection, Worker } from "@temporalio/worker";
import { TEMPORAL_ADDRESS, TEMPORAL_TASK_QUEUE, TEMPORAL_NAMESPACE } from "../config/env.js";
import * as activities from "./activities/index.js";
import { fileURLToPath } from "node:url";
import { extname } from "node:path";

const workflowsExtension = extname(fileURLToPath(import.meta.url));

async function run() {
    const connection = await NativeConnection.connect({
        address: TEMPORAL_ADDRESS,
    });

    const worker = await Worker.create({
        connection,
        namespace: TEMPORAL_NAMESPACE,
        taskQueue: TEMPORAL_TASK_QUEUE,
        activities,
        workflowsPath: fileURLToPath(new URL(`./workflows/index${workflowsExtension}`, import.meta.url)),
    });
    console.log("[Temporal] Worker started for task queue", TEMPORAL_TASK_QUEUE);
    
    await worker.run();
}

run().catch((err) => {
    console.error('[temporal] Error starting worker', err);
    process.exit(1);
});