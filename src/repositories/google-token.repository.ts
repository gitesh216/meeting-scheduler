import { getRedisClient } from "../config/redis-client.js";

function key(userId: number): string {
    return `google:calendar:refresh_token:${userId}`;
}

export async function saveGoogleRefreshToken(
    userId: number,
    token: string,
): Promise<void> {
    const redis = getRedisClient();
    await redis.set(key(userId), token);
}

export async function getGoogleRefreshToken(
    userId: number,
): Promise<string | null> {
    const redis = getRedisClient();
    return redis.get(key(userId));
}
