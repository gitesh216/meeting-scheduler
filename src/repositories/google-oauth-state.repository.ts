import { randomUUID } from "crypto";
import { getRedisClient } from "../config/redis-client.js";

const TTL_SECONDS = 600;

function key(nonce: string): string {
    return `google:calendar:oauth_state:${nonce}`;
}

export async function createOauthState(userId: number): Promise<string> {
    const nonce = randomUUID();
    const redis = getRedisClient();
    await redis.set(key(nonce), String(userId), "EX", TTL_SECONDS);
    return nonce;
}

export async function consumeOauthState(nonce: string): Promise<number | null> {
    const redis = getRedisClient();
    const userId = await redis.get(key(nonce));
    if (!userId) return null;
    await redis.del(key(nonce));
    return Number(userId);
}
