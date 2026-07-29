import { google } from "googleapis";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_CALENDAR_ID,
} from "../config/env.js";
import { findBookingById } from "../repositories/booking.repository.js";
import { notFound, badRequest } from "../utils/api-error.js";

import { getRedisClient } from "../config/redis-client.js";
import { randomUUID } from "crypto";

const OAUTH_STATE_TTL_SECONDS = 600; // 10 minutes

function oauthStateKey(nonce: string): string {
    return `google:calendar:oauth_state:${nonce}`;
}

async function createOauthState(userId: number): Promise<string> {
    const nonce = randomUUID();
    const redis = getRedisClient();
    await redis.set(
        oauthStateKey(nonce),
        String(userId),
        "EX",
        OAUTH_STATE_TTL_SECONDS,
    );
    return nonce;
}

async function consumeOauthState(nonce: string): Promise<number | null> {
    const redis = getRedisClient();
    const key = oauthStateKey(nonce);

    const userId = await redis.get(key);
    if (!userId) return null;

    await redis.del(key); // one-time use

    return Number(userId);
}

function googleRefreshTokenKey(userId: number): string {
    return `google:calendar:refresh_token:${userId}`;
}

async function saveGoogleRefreshToken(
    userId: number,
    token: string,
): Promise<void> {
    const redis = getRedisClient();
    await redis.set(googleRefreshTokenKey(userId), token);
}

async function getStoredGoogleRefreshToken(
    userId: number,
): Promise<string | null> {
    const redis = getRedisClient();
    return redis.get(googleRefreshTokenKey(userId));
}

const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
];

export function isProjectCalendarConfigured(): boolean {
    return Boolean(
        GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REDIRECT_URI,
    );
}

export function getGoogleOauthClient(): InstanceType<
    typeof google.auth.OAuth2
> {
    if (!isProjectCalendarConfigured()) {
        throw new Error("Google project calendar is not configured");
    }

    return new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
    );
}

export async function getSetupAuthUrl(userId: number): Promise<string> {
    const client = getGoogleOauthClient();
    const state = await createOauthState(userId);

    return client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
        state,
    });
}

export async function exchangeSetupCode(state: string, code: string) {
    const userId = await consumeOauthState(state);
    if (!userId) {
        throw badRequest(
            "Invalid or expired OAuth state — please restart the Google Calendar connection",
        );
    }

    const client = getGoogleOauthClient();

    const { tokens } = await client.getToken(code);
    if (!tokens.refresh_token) {
        throw badRequest(
            "Google did not return a refresh token. Try disconnecting the app from your Google Account settings and reconnecting.",
        );
    }
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        version: "v2",
        auth: client,
    });
    const { data } = await oauth2.userinfo.get();
    if (!data.email) {
        throw badRequest("Unable to retrieve user's email from Google.");
    }

    await saveGoogleRefreshToken(userId, tokens.refresh_token);

    return { email: data.email };
}

export async function getGoogleCalendarClient(
    userId: number,
): Promise<InstanceType<typeof google.auth.OAuth2>> {
    if (!isProjectCalendarConfigured()) {
        throw new Error("Google project calendar is not configured");
    }

    const refreshToken = await getStoredGoogleRefreshToken(userId);
    if (!refreshToken) {
        throw new Error(`User ${userId} has not connected a Google Calendar`);
    }

    const client = getGoogleOauthClient();
    client.setCredentials({ refresh_token: refreshToken });
    return client;
}

export async function createGoogleCalendarEvent(bookingId: number) {
    const booking = await findBookingById(bookingId);

    if (!booking || booking.status !== "CONFIRMED") {
        throw notFound("Confirmed booking not found");
    }

    const client = await getGoogleCalendarClient(booking.hostId);

    const calendar = await google.calendar({
        version: "v3",
        auth: client,
    });

    const event = await calendar.events.insert({
        calendarId: GOOGLE_CALENDAR_ID,
        conferenceDataVersion: 1,
        sendUpdates: "all",
        requestBody: {
            summary: `${booking.eventType.title} with ${booking.inviteeName}`,
            description: [
                booking.eventType.description,
                booking.inviteeNotes
                    ? `Invitee note: ${booking.inviteeNotes}`
                    : "",
            ].join("\n\n"),
            start: {
                dateTime: booking.slot.startAt.toISOString(),
                timeZone: booking.host.timezone,
            },
            end: {
                dateTime: booking.slot.endAt.toISOString(),
                timeZone: booking.host.timezone,
            },
            attendees: [
                {
                    email: booking.inviteeEmail,
                    displayName: booking.inviteeName,
                },
            ],
            conferenceData: {
                createRequest: {
                    requestId: bookingId.toString(),
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
        },
    });

    const meetLink =
        event.data.conferenceData?.entryPoints?.find(
            (entryPoint) => entryPoint.entryPointType === "video",
        )?.uri ??
        event.data.hangoutLink ??
        null;

    if (!event.data.id || !meetLink) {
        throw new Error("Unable to create Google Calendar event");
    }

    return {
        meetLink,
        calendarEventId: event.data.id,
    };
}
