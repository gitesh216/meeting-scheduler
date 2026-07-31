import { getRedisClient } from "../config/redis-client.js";

interface GoogleTokenRecord {
    refreshToken: string;
    email: string;
}

function key(userId: number): string {
    return `google:calendar:refresh_token:${userId}`;
}

export async function saveGoogleRefreshToken(
    userId: number,
    token: string,
    email: string,
): Promise<void> {
    const redis = getRedisClient();
    const record: GoogleTokenRecord = { refreshToken: token, email };
    await redis.set(key(userId), JSON.stringify(record));
}

export async function getGoogleRefreshToken(
    userId: number,
): Promise<string | null> {
    const record = await getGoogleTokenRecord(userId);
    return record?.refreshToken ?? null;
}

export async function getGoogleTokenRecord(
    userId: number,
): Promise<GoogleTokenRecord | null> {
    const redis = getRedisClient();
    const raw = await redis.get(key(userId));
    if (!raw) {
        return null;
    }
    return JSON.parse(raw) as GoogleTokenRecord;
}
