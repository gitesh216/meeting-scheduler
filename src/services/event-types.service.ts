import {
    CreateEventTypeDto,
    UpdateEventTypeDto,
} from "../dtos/event-type.dto.js";
import {
    create,
    findActiveByHostIdAndEventSlug,
    findByHostId,
    findById,
    remove,
    slugExistsForHost,
    update,
} from "../repositories/event-type.repository.js";
import { getById } from "../repositories/user.repository.js";
import { conflict, forbidden, notFound } from "../utils/api-error.js";
import slug from "slug";

export async function listEventTypes(hostId: number) {
    const eventTypes = await findByHostId(hostId);
    if (!eventTypes) {
        throw notFound("Event types not found");
    }
    return eventTypes;
}

export async function createEventType(
    hostId: number,
    data: CreateEventTypeDto,
) {
    const eventSlug = data.slug ?? slug(data.title, { lower: true });

    if (!eventSlug) {
        throw conflict("Event slug not found");
    }

    const isSlugTaken = await slugExistsForHost(hostId, eventSlug);

    if (isSlugTaken) {
        throw conflict("Event slug already exists");
    }

    return create(hostId, { ...data, slug: eventSlug });
}

export async function removeEventType(hostId: number, id: number) {
    const eventType = await findById(id);
    if (!eventType) {
        throw notFound("Event type not found");
    }
    if (eventType.hostId !== hostId) {
        throw forbidden("You are not authorized delete this event type");
    }
    return remove(id);
}

export async function getEventTypeById(id: number, hostId: number) {
    const eventType = await findById(id);
    if (!eventType) {
        throw notFound("Event type not found");
    }

    if (eventType.hostId !== hostId) {
        throw forbidden("You are not authorized to view this event type");
    }

    return eventType;
}

export async function getEventTypePublic(hostId: number, eventSlug: string) {
    const eventType = await findActiveByHostIdAndEventSlug(hostId, eventSlug);

    if (!eventType) {
        throw notFound("Event type not found");
    }

    const host = await getById(eventType.hostId);
    if (!host) {
        throw notFound("Host not found");
    }

    return {
        eventType: {
            id: eventType.id,
            title: eventType.title,
            description: eventType.description,
            durationMinutes: eventType.durationMinutes,
            locationType: eventType.locationType,
        },
        host: {
            name: host.name,
            email: host.email,
        },
    };
}

export async function updateEventType(
    hostId: number,
    id: number,
    data: UpdateEventTypeDto,
) {
    const eventType = await findById(id);
    if (!eventType) {
        throw notFound("Event type not found");
    }

    if (eventType.hostId !== hostId) {
        throw forbidden("You are not authorized to update this event type");
    }

    if (data.slug && data.slug !== eventType.slug) {
        const isSlugTaken = await slugExistsForHost(hostId, data.slug);
        if (isSlugTaken) {
            throw conflict(
                "A event type with this slug already exists, plase use a different slug",
            );
        }
    }
    return update(id, data);
}
