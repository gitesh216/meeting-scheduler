export class IdGenerator {
    private static readonly EPOCH = 1704067200000n; // Jan 1, 2024

    private sequence = 0n;
    private lastTimestamp = -1n;

    constructor(private readonly machineId: bigint) {
        if (machineId < 0n || machineId > 1023n) {
            throw new Error("Machine ID must be between 0 and 1023");
        }
    }

    private currentMillis(): bigint {
        return BigInt(Date.now());
    }

    generate(): bigint {
        let timestamp = this.currentMillis();

        // Protect against clock rollback
        if (timestamp < this.lastTimestamp) {
            throw new Error(
                `Clock moved backwards by ${this.lastTimestamp - timestamp} ms`,
            );
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence++;

            // 12 bits = 4096 IDs per millisecond
            if (this.sequence > 4095n) {
                while (timestamp <= this.lastTimestamp) {
                    timestamp = this.currentMillis();
                }

                this.sequence = 0n;
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        // Layout:
        // 41 bits timestamp
        // 10 bits machine ID
        // 12 bits sequence
        return (
            ((timestamp - IdGenerator.EPOCH) << 22n) |
            (this.machineId << 12n) |
            this.sequence
        );
    }
}

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function encodeBase62(num: bigint): string {
    if (num === 0n) {
        return "0";
    }

    let result = "";

    while (num > 0n) {
        const remainder = Number(num % 62n);
        result = BASE62[remainder] + result;
        num /= 62n;
    }

    return result;
}

export function decodeBase62(str: string): bigint {
    let result = 0n;

    for (const char of str) {
        const index = BASE62.indexOf(char);

        if (index === -1) {
            throw new Error(`Invalid Base62 character: ${char}`);
        }

        result = result * 62n + BigInt(index);
    }

    return result;
}
