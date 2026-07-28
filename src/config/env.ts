import "dotenv/config";

// TODO: type validaton
export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MACHINE_ID = process.env.MACHINE_ID || 0;
export const SLOT_GENERATION_DAYS = process.env.SLOT_GENERATION_DAYS || 30;
export const TEMPORAL_ADDRESS =
    process.env.TEMPORAL_ADDRESS || "localhost:7233";
export const TEMPORAL_NAMESPACE = process.env.TEMPORAL_NAMESPACE || "default";
export const TEMPORAL_TASK_QUEUE =
    process.env.TEMPORAL_TASK_QUEUE || "calendly-tasks";
export const TEMPORAL_ENABLED = process.env.TEMPORAL_ENABLED === "true";

export const SMTP_HOST = process.env.SMTP_HOST || "localhost";
export const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025;
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
export const EMAIL_FROM =
    process.env.EMAIL_FROM || "Calendly <noreply@example.com>";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";
export const GOOGLE_SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL || "";
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || ""; // TODO: Add to redis
export const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";