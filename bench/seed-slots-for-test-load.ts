// bench/seed-slots-for-load-test.ts
import { prisma } from "../src/config/database.js";
import { writeFileSync } from "fs";

async function main() {
    // 1. Wipe previous test user to trigger a fresh state
    await prisma.user.deleteMany({
        where: { email: "load-test-host@example.com" },
    });

    // 2. Create host with 24/7 Availability Rules so Temporal accepts the slots
    const host = await prisma.user.create({
        data: {
            email: "load-test-host@example.com",
            name: "Load Test Host",
            password: "securepass123",
            slug: "load-test-host",
            timezone: "UTC",
            eventTypes: {
                create: {
                    title: "Load Test 15m",
                    slug: "load-test-15m",
                    durationMinutes: 15,
                    bufferBeforeMinutes: 0,
                    bufferAfterMinutes: 0,
                    isActive: true,
                },
            },
            // Add 24/7 availability for all 7 days of the week (0-6)
            availabilityRules: {
                create: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
                    weekday,
                    startTime: "00:00",
                    endTime: "23:59",
                    timezone: "UTC",
                    isActive: true,
                })),
            },
        },
        include: {
            eventTypes: true,
        },
    });

    const hostId = host.id;
    const eventTypeId = host.eventTypes[0].id;

    // 3. Generate 2,000 slots with a 5-minute gap
    const slots = [];
    const start = new Date("2026-09-01T09:00:00Z");

    for (let i = 0; i < 2000; i++) {
        const slotStartTime = start.getTime() + i * 15 * 60_000;
        slots.push({
            hostId,
            eventTypeId,
            startAt: new Date(slotStartTime),
            endAt: new Date(slotStartTime + 15 * 60_000), // matches durationMinutes
            status: "AVAILABLE",
        });
    }

    // 4. Batch insert into PostgreSQL
    await prisma.slot.createMany({ data: slots, skipDuplicates: true });

    // 5. Fetch generated slots and output config
    const created = await prisma.slot.findMany({
        where: { hostId, eventTypeId, status: "AVAILABLE" },
        select: { id: true },
        take: 2000,
    });

    const payload = {
        hostId: hostId,
        slotIds: created.map((s) => s.id),
    };

    writeFileSync("k6/test-config.json", JSON.stringify(payload, null, 2));
    console.log(
        `Successfully seeded ${created.length} valid slots for Host ID ${hostId}`,
    );
}

main();
