import { Router } from "express";
import { getPublicEventType } from "../controllers/event-type.controller.js";

export const publicEventRouter: Router = Router();

/**
 * @openapi
 * /api/users/{userId}/event-types/{slug}:
 *   get:
 *     summary: Get public event type
 *     description: Retrieve a public event type by user ID and slug (no authentication required)
 *     tags:
 *       - Public Event Types
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Host user ID
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Event type slug
 *     responses:
 *       '200':
 *         description: Event type found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventType'
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
publicEventRouter.get("/users/:userId/event-types/:slug", getPublicEventType);
