import { Redis } from "ioredis";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./env.js";

type RedisClient = InstanceType<typeof Redis>;

let redis: RedisClient | undefined;

/**
 * Returns a singleton Redis client. Creates it on first call,
 * reuses the same connection on every subsequent call.
 */
export function getRedisClient(): RedisClient {
    if (redis) return redis;

    redis = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        // Retry strategy: keep trying to reconnect, backing off up to 2s
        retryStrategy(times: number) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        // Avoid throwing on startup if Redis isn't up yet — let it queue
        // commands and retry instead of failing immediately.
        maxRetriesPerRequest: 3,
        lazyConnect: false,
    });

    redis.on("connect", () => {
        console.log(`[redis] connecting to ${REDIS_HOST}:${REDIS_PORT}...`);
    });

    redis.on("ready", () => {
        console.log("[redis] connected and ready");
    });

    redis.on("error", (err: Error) => {
        console.error("[redis] connection error:", err.message);
    });

    redis.on("close", () => {
        console.warn("[redis] connection closed");
    });

    redis.on("reconnecting", (delay: number) => {
        console.log(`[redis] reconnecting in ${delay}ms`);
    });

    return redis;
}

/**
 * Gracefully closes the Redis connection.
 * Call this during app shutdown (e.g. on SIGINT/SIGTERM).
 */
export async function closeRedisClient(): Promise<void> {
    if (!redis) return;
    try {
        await redis.quit(); // waits for pending commands, then closes
        console.log("[redis] connection closed gracefully");
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(
            "[redis] error during graceful shutdown, forcing disconnect:",
            message,
        );
        redis.disconnect(); // fallback: force-close if quit() hangs/fails
    } finally {
        redis = undefined;
    }
}

// Handle graceful shutdown automatically when this module is used
// as the app's central Redis entrypoint.
process.on("SIGINT", async () => {
    await closeRedisClient();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await closeRedisClient();
    process.exit(0);
});
