import { prisma } from "../config/database.js";

export async function findBookedSlotsByHostInRange(
    hostId: number,
    startDate: Date,
    endDate: Date,
) {
    const slots = await prisma.slot.findMany({
        where: {
            hostId,
            startAt: {
                gte: startDate,
                lte: endDate,
            },
            status: "BOOKED",
        },
    });
    return slots;
}
