import "dotenv/config";

// TODO: type validaton
export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MACHINE_ID = process.env.MACHINE_ID || 0;
export const SLOT_GENERATION_DAYS = process.env.SLOT_GENERATION_DAYS || 30;