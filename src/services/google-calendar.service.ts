import { google } from "googleapis";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_CALENDAR_ID,
} from "../config/env.js";
import { findBookingById } from "../repositories/booking.repository.js";
import { notFound, badRequest } from "../utils/api-error.js";
import {
    createOauthState,
    consumeOauthState,
} from "../repositories/google-oauth-state.repository.js";
import {
    saveGoogleRefreshToken,
    getGoogleRefreshToken,
    getGoogleTokenRecord,
    deleteGoogleRefreshToken,
} from "../repositories/google-token.repository.js";

const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
];

export interface GoogleCalendarStatus {
    connected: boolean;
    email?: string;
}

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

    await saveGoogleRefreshToken(userId, tokens.refresh_token, data.email);

    return { email: data.email };
}

export async function getGoogleCalendarClient(
    userId: number,
): Promise<InstanceType<typeof google.auth.OAuth2>> {
    if (!isProjectCalendarConfigured()) {
        throw new Error("Google project calendar is not configured");
    }

    const refreshToken = await getGoogleRefreshToken(userId);
    if (!refreshToken) {
        throw new Error(`User ${userId} has not connected a Google Calendar`);
    }

    const client = getGoogleOauthClient();
    client.setCredentials({ refresh_token: refreshToken });
    return client;
}

export async function getGoogleCalendarStatus(
    userId: number,
): Promise<GoogleCalendarStatus> {
    const record = await getGoogleTokenRecord(userId);
    if (!record) {
        return { connected: false };
    }
    return { connected: true, email: record.email };
}

export async function disconnectGoogleCalendar(userId: number): Promise<void> {
    const record = await getGoogleTokenRecord(userId);
    if (!record) return; // already disconnected — idempotent

    try {
        const client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI,
        );
        await client.revokeToken(record.refreshToken);
    } catch (err) {
        console.warn(
            `[google-calendar] Token revocation failed for user ${userId}, deleting local record anyway`,
            err,
        );
    }

    await deleteGoogleRefreshToken(userId);
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
