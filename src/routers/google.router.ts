import { Router } from "express";
import {
    setupGoogleCallback,
    setupGoogleAuthUrl,
    getGoogleCalendarStatusHandler,
    disconnectGoogleCalendarHandler
} from "../controllers/google.controller.js";
import { requireUserId } from "../middlewares/require-user-id.js";

export const googleIntegrationRouter: Router = Router();

googleIntegrationRouter.use(requireUserId);

/**
 * @openapi
 * /api/google-calendar/connect:
 *   get:
 *     summary: Get Google OAuth authorization URL
 *     description: Get the URL to redirect user to for Google Calendar authorization
 *     tags:
 *       - Google Integration
 *     security:
 *       - userId: []
 *     responses:
 *       '200':
 *         description: Authorization URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoogleAuthUrlResponse'
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
googleIntegrationRouter.get("/google-calendar/connect", setupGoogleAuthUrl);

/**
 * @openapi
 * /api/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handle Google OAuth callback after user authorization
 *     tags:
 *       - Google Integration
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *     responses:
 *       '200':
 *         description: Google account connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoogleCallbackResponse'
 *       '400':
 *         description: Invalid or missing authorization code/state
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
googleIntegrationRouter.get("/callback", setupGoogleCallback);

/**
 * @openapi
 * /api/google-calendar/status:
 *   get:
 *     summary: Get Google Calendar connection status
 *     description: Check if the user has Google Calendar connected
 *     tags:
 *       - Google Integration
 *     security:
 *       - userId: []
 *     responses:
 *       '200':
 *         description: Google Calendar connection status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoogleCalendarStatusResponse'
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
googleIntegrationRouter.get(
    "/google-calendar/status",
    getGoogleCalendarStatusHandler,
);

/**
 * @openapi
 * /api/google-calendar/disconnect:
 *   delete:
 *     summary: Disconnect Google Calendar
 *     description: Disconnect the user's Google Calendar account
 *     tags:
 *       - Google Integration
 *     security:
 *       - userId: []
 *     responses:
 *       '200':
 *         description: Google Calendar disconnected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
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
googleIntegrationRouter.delete("/google-calendar/disconnect", disconnectGoogleCalendarHandler);