import { Router } from "express";
import {
    createException,
    createRule,
    listExceptions,
    listRules,
    removeException,
    removeRule,
    updateException,
    updateRule,
} from "../controllers/availability.controller.js";
import {
    createAvailabilityExceptionSchema,
    createAvailabilityRuleSchema,
    updateAvailabilityExceptionSchema,
    updateAvailabilityRuleSchema,
} from "../dtos/availability.dto.js";
import { requireUserId } from "../middlewares/require-user-id.js";
import { validate } from "../middlewares/validate.js";

export const availabilityRouter: Router = Router();

availabilityRouter.use(requireUserId);

/**
 * @openapi
 * /api/availability/rules:
 *   get:
 *     summary: List availability rules
 *     description: Retrieve all availability rules for the authenticated user
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     responses:
 *       '200':
 *         description: A list of availability rules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AvailabilityRule'
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
availabilityRouter.get("/rules", listRules);

/**
 * @openapi
 * /api/availability/rules:
 *   post:
 *     summary: Create availability rule
 *     description: Create a new recurring availability rule for the authenticated user
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAvailabilityRuleRequest'
 *     responses:
 *       '201':
 *         description: Availability rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityRule'
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
availabilityRouter.post(
    "/rules",
    validate(createAvailabilityRuleSchema),
    createRule,
);

/**
 * @openapi
 * /api/availability/rules/{id}:
 *   patch:
 *     summary: Update availability rule
 *     description: Update an existing availability rule
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Availability rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvailabilityRuleRequest'
 *     responses:
 *       '200':
 *         description: Availability rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityRule'
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
 *         description: Availability rule not found
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
availabilityRouter.patch(
    "/rules/:id",
    validate(updateAvailabilityRuleSchema),
    updateRule,
);

/**
 * @openapi
 * /api/availability/rules/{id}:
 *   delete:
 *     summary: Delete availability rule
 *     description: Delete an availability rule by ID
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Availability rule ID
 *     responses:
 *       '204':
 *         description: Availability rule deleted successfully
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Availability rule not found
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
availabilityRouter.delete("/rules/:id", removeRule);

/**
 * @openapi
 * /api/availability/exceptions:
 *   get:
 *     summary: List availability exceptions
 *     description: Retrieve all availability exceptions for the authenticated user
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     responses:
 *       '200':
 *         description: A list of availability exceptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AvailabilityException'
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
availabilityRouter.get("/exceptions", listExceptions);

/**
 * @openapi
 * /api/availability/exceptions:
 *   post:
 *     summary: Create availability exception
 *     description: Create a new availability exception (override) for a specific date
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAvailabilityExceptionRequest'
 *     responses:
 *       '201':
 *         description: Availability exception created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityException'
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
availabilityRouter.post(
    "/exceptions",
    validate(createAvailabilityExceptionSchema),
    createException,
);

/**
 * @openapi
 * /api/availability/exceptions/{id}:
 *   patch:
 *     summary: Update availability exception
 *     description: Update an existing availability exception
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Availability exception ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvailabilityExceptionRequest'
 *     responses:
 *       '200':
 *         description: Availability exception updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityException'
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
 *         description: Availability exception not found
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
availabilityRouter.patch(
    "/exceptions/:id",
    validate(updateAvailabilityExceptionSchema),
    updateException,
);

/**
 * @openapi
 * /api/availability/exceptions/{id}:
 *   delete:
 *     summary: Delete availability exception
 *     description: Delete an availability exception by ID
 *     tags:
 *       - Availability
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Availability exception ID
 *     responses:
 *       '204':
 *         description: Availability exception deleted successfully
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Availability exception not found
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
availabilityRouter.delete("/exceptions/:id", removeException);