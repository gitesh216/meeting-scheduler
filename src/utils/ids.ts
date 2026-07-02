import { MACHINE_ID } from "../config/env.js";
import { IdGenerator } from "../utils/id-generator.js";

const machineId = MACHINE_ID;

if (!machineId) {
    throw new Error("MACHINE_ID environment variable is required");
}

export const idGenerator = new IdGenerator(BigInt(machineId));
