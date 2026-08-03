import { Router } from "express";
import { requireUserId } from "../middlewares/require-user-id.js";
import {
    create,
    getById,
    list,
    remove,
    update,
} from "../controllers/event-type.controller.js";
import { validate } from "../middlewares/validate.js";
import {
    createEventTypeSchema,
    UpdateEventTypeSchema,
} from "../dtos/event-type.dto.js";

export const eventTypeRouter: Router = Router();

/**
 * @openapi
 * /api/event-types:
 *   get:
 *     summary: List event types
 *     description: Retrieve a list of event types for the authenticated user
 *     tags:
 *       - Event Types
 *     security:
 *       - userId: []
 *     responses:
 *       '200':
 *         description: A list of event types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventType'
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
eventTypeRouter.get("/", requireUserId, list);

/**
 * @openapi
 * /api/event-types/{id}:
 *   get:
 *     summary: Get event type by ID
 *     description: Retrieve a single event type by its ID
 *     tags:
 *       - Event Types
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event type ID
 *     responses:
 *       '200':
 *         description: Event type found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventType'
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Event type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
eventTypeRouter.get("/:id", requireUserId, getById);

/**
 * @openapi
 * /api/event-types:
 *   post:
 *     summary: Create event type
 *     description: Create a new event type for the authenticated user
 *     tags:
 *       - Event Types
 *     security:
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventTypeRequest'
 *     responses:
 *       '201':
 *         description: Event type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventType'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '409':
 *         description: Event type with this slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
eventTypeRouter.post(
    "/",
    requireUserId,
    validate(createEventTypeSchema),
    create,
);

/**
 * @openapi
 * /api/event-types/{id}:
 *   patch:
 *     summary: Update event type
 *     description: Update an existing event type
 *     tags:
 *       - Event Types
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventTypeRequest'
 *     responses:
 *       '200':
 *         description: Event type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventType'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Event type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
eventTypeRouter.patch(
    "/:id",
    requireUserId,
    validate(UpdateEventTypeSchema),
    update,
);

/**
 * @openapi
 * /api/event-types/{id}:
 *   delete:
 *     summary: Delete event type
 *     description: Delete an event type by ID
 *     tags:
 *       - Event Types
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event type ID
 *     responses:
 *       '204':
 *         description: Event type deleted successfully
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Event type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
eventTypeRouter.delete("/:id", requireUserId, remove);