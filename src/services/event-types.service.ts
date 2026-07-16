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
import { idGenerator } from "../utils/ids.js";
import { encodeBase62 } from "../utils/id-generator.js";
import { startRegenerateHostSlotsWorkflow } from "../temporal/client.js";

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
    const baseSlug = data.slug ?? slug(data.title, { lower: true });

    if (!baseSlug) {
        throw conflict("Event slug not found");
    }
    // Generate a globally unique ID
    const id = idGenerator.generate();

    // Convert to a short URL-friendly string
    const shortId = encodeBase62(id);

    // Final slug
    const eventSlug = `${baseSlug}-${shortId}`;

    const isSlugTaken = await slugExistsForHost(hostId, eventSlug);

    if (isSlugTaken) {
        throw conflict("Event slug already exists");
    }

    const eventType = create(hostId, { ...data, slug: eventSlug });
    await startRegenerateHostSlotsWorkflow({ hostId });
    return eventType;
}

export async function removeEventType(hostId: number, id: number) {
    const eventType = await findById(id);
    if (!eventType) {
        throw notFound("Event type not found");
    }
    if (eventType.hostId !== hostId) {
        throw forbidden("You are not authorized delete this event type");
    }
    const removedEventType = await remove(id);
    await startRegenerateHostSlotsWorkflow({ hostId });
    return removedEventType;
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
    const updatedEventType = await update(id, data);
    await startRegenerateHostSlotsWorkflow({ hostId });
    return updatedEventType;
}
