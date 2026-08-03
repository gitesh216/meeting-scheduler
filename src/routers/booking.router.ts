import { Router } from "express";
import { create1, create2, list, remove } from "../controllers/booking.controller.js";
import {
    createBookingSchema,
    listHostBookingsQuerySchema,
} from "../dtos/booking.dto.js";
import { requireUserId } from "../middlewares/require-user-id.js";
import { validate, validateQuery } from "../middlewares/validate.js";

export const bookingRouter: Router = Router();

bookingRouter.use(requireUserId);

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     summary: List bookings
 *     description: Retrieve a list of bookings for the authenticated user with optional filters
 *     tags:
 *       - Bookings
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [CONFIRMED, PENDING, CANCELLED]
 *         description: Filter by booking status
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$'
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$'
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       '200':
 *         description: A list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
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
bookingRouter.get("/", validateQuery(listHostBookingsQuerySchema), list);

/**
 * @openapi
 * /api/bookings/pessimistic:
 *   post:
 *     summary: Create booking (pessimistic locking)
 *     description: Create a new booking using pessimistic locking to prevent double bookings
 *     tags:
 *       - Bookings
 *     security:
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       '201':
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       '400':
 *         description: Validation error or slot not available
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
 *         description: Slot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '409':
 *         description: Slot already booked
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
bookingRouter.post("/pessimistic", validate(createBookingSchema), create1);

/**
 * @openapi
 * /api/bookings/optimistic:
 *   post:
 *     summary: Create booking (optimistic locking)
 *     description: Create a new booking using optimistic locking to prevent double bookings
 *     tags:
 *       - Bookings
 *     security:
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       '201':
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       '400':
 *         description: Validation error or slot not available
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
 *         description: Slot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '409':
 *         description: Slot already booked (concurrency conflict)
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
bookingRouter.post("/optimistic", validate(createBookingSchema), create2);

/**
 * @openapi
 * /api/bookings/{bookingId}:
 *   delete:
 *     summary: Cancel booking
 *     description: Cancel a booking by ID
 *     tags:
 *       - Bookings
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       '200':
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       '401':
 *         description: Unauthorized - Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Booking not found
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
bookingRouter.delete("/:bookingId", remove);