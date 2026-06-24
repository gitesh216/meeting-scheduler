import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().email("Invalid email"),

    name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
