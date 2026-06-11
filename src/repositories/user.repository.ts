import { prisma } from "../config/database.js";

export async function getAll() {
    const users = await prisma.user.findMany();
    if(!users) {
        throw new Error("No users found");
    }
    return users;
}