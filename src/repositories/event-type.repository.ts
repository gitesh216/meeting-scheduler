import { prisma } from "../config/database.js";
import {
    CreateEventTypeDto,
    UpdateEventTypeDto,
} from "../dtos/event-type.dto.js";

export async function findByHostId(hostId: number) {
    const eventTypes = await prisma.eventType.findMany({
        where: {
            hostId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return eventTypes;
}

export async function findById(id: number) {
    const eventType = await prisma.eventType.findUnique({
        where: {
            id,
        },
    });

    return eventType;
}

export async function create(
    hostId: number,
    data: CreateEventTypeDto & { slug: string },
) {
    const eventType = await prisma.eventType.create({
        data: {
            hostId,
            ...data,
        },
    });

    return eventType;
}

export async function update(id: number, data: UpdateEventTypeDto) {
    const eventType = await prisma.eventType.update({
        where: {
            id,
        },
        data: data,
    });

    return eventType;
}

export async function remove(id: number) {
    const eventType = await prisma.eventType.delete({
        where: {
            id,
        },
    });

    return eventType;
}

export async function findByHostAndSlug(hostId: number, slug: string) {
    const eventType = await prisma.eventType.findFirst({
        where: {
            hostId,
            slug,
        },
    });

    return eventType;
}

// Function to check if a slug already exists for a user
export async function slugExistsForHost(hostId: number, slug: string) {
    const eventType = await prisma.eventType.findFirst({
        where: {
            hostId,
            slug,
        },
    });

    return eventType !== null;
}

export async function findActiveByHostIdAndEventSlug(
    hostId: number,
    eventSlug: string,
) {
    const eventType = await prisma.eventType.findFirst({
        where: {
            hostId,
            slug: eventSlug,
            isActive: true,
        },
    });

    return eventType;
}

export async function findActiveEventTypesByHost(hostId: number) {
    const eventTypes = await prisma.eventType.findMany({
        where: {
            hostId,
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return eventTypes;
}
