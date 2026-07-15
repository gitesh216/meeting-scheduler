import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const createAvailabilityRuleBaseSchema = z.object({
    weekday: z.number().int().min(0).max(6),
    startTime: z
        .string()
        .regex(timeRegex, "Start time must be in HH:mm format"),
    endTime: z.string().regex(timeRegex, "End time must be in HH:mm format"),
    isActive: z.boolean().default(true),
    timezone: z.string().default("UTC"),
});

export const createAvailabilityRuleSchema =
    createAvailabilityRuleBaseSchema.refine(
        (rule) => rule.startTime < rule.endTime,
        { message: "Start time must be before end time" },
    );

export const updateAvailabilityRuleSchema =
    createAvailabilityRuleBaseSchema.partial();

export const availabilityExceptionBaseSchema = z.object({
    date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
    type: z.enum(["BLOCK_FULL_DAY", "BLOCK_PARTIAL", "ADD_AVAILABLE_WINDOW"]),
    startTime: z
        .string()
        .regex(timeRegex, "Start time must be in HH:mm format")
        .optional(),
    endTime: z
        .string()
        .regex(timeRegex, "End time must be in HH:mm format")
        .optional(),
    timezone: z.string().default("UTC"),
    reason: z.string().max(500).optional(),
});

export const createAvailabilityExceptionSchema = z
    .object({
        date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
        type: z.enum([
            "BLOCK_FULL_DAY",
            "BLOCK_PARTIAL",
            "ADD_AVAILABLE_WINDOW",
        ]),
        startTime: z
            .string()
            .regex(timeRegex, "Start time must be in HH:mm format")
            .optional(),
        endTime: z
            .string()
            .regex(timeRegex, "End time must be in HH:mm format")
            .optional(),
        timezone: z.string().default("UTC"),
        reason: z.string().max(500).optional(),
    })
    .superRefine((data, ctx) => {
        // Validate that the date is actually valid (not just format)
        const dateObj = new Date(`${data.date}T00:00:00.000Z`);
        const [year, month, day] = data.date.split("-").map(Number);
        if (
            dateObj.getUTCFullYear() !== year ||
            dateObj.getUTCMonth() + 1 !== month ||
            dateObj.getUTCDate() !== day
        ) {
            ctx.addIssue({
                path: ["date"],
                code: "custom",
                message: "Invalid date",
            });
        }

        if (data.type !== "BLOCK_FULL_DAY") {
            if (!data.startTime) {
                ctx.addIssue({
                    path: ["startTime"],
                    code: "custom",
                    message:
                        "Start time is required for a non-full day exception",
                });
            }
            if (!data.endTime) {
                ctx.addIssue({
                    path: ["endTime"],
                    code: "custom",
                    message:
                        "End time is required for a non-full day exception",
                });
            }
            if (
                data.startTime &&
                data.endTime &&
                data.startTime >= data.endTime
            ) {
                ctx.addIssue({
                    path: ["endTime"],
                    code: "custom",
                    message: "End time must be after start time",
                });
            }
        }
    });

export const updateAvailabilityExceptionSchema = availabilityExceptionBaseSchema
    .partial()
    .superRefine((data, ctx) => {
        // Validate that the date is actually valid (not just format) if provided
        if (data.date) {
            const dateObj = new Date(`${data.date}T00:00:00.000Z`);
            const [year, month, day] = data.date.split("-").map(Number);
            if (
                dateObj.getUTCFullYear() !== year ||
                dateObj.getUTCMonth() + 1 !== month ||
                dateObj.getUTCDate() !== day
            ) {
                ctx.addIssue({
                    path: ["date"],
                    code: "custom",
                    message: "Invalid date",
                });
            }
        }

        // Validate time ordering for partial updates
        if (
            data.startTime &&
            data.endTime &&
            data.startTime >= data.endTime
        ) {
            ctx.addIssue({
                path: ["endTime"],
                code: "custom",
                message: "End time must be after start time",
            });
        }

        // If type is being changed to non-BLOCK_FULL_DAY, ensure times are provided
        if (
            data.type &&
            data.type !== "BLOCK_FULL_DAY" &&
            (!data.startTime || !data.endTime)
        ) {
            if (!data.startTime) {
                ctx.addIssue({
                    path: ["startTime"],
                    code: "custom",
                    message:
                        "Start time is required for a non-full day exception",
                });
            }
            if (!data.endTime) {
                ctx.addIssue({
                    path: ["endTime"],
                    code: "custom",
                    message:
                        "End time is required for a non-full day exception",
                });
            }
        }
    });

export type CreateAvailabilityRuleDto = z.infer<
    typeof createAvailabilityRuleSchema
>;

export type UpdateAvailabilityRuleDto = z.infer<
    typeof updateAvailabilityRuleSchema
>;

export type CreateAvailabilityExceptionDto = z.infer<
    typeof createAvailabilityExceptionSchema
>;

export type UpdateAvailabilityExceptionDto = z.infer<
    typeof updateAvailabilityExceptionSchema
>;
