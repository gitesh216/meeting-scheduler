import { prisma } from "../config/database.js";

export async function getAll() {
    const users = await prisma.user.findMany();
    if (!users) {
        throw new Error("No users found");
    }
    return users;
}

export async function getById(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new Error("No user found");
        }
        return user;
    } catch (error) {
        console.log("Error in get by ID", error);
    }
}
