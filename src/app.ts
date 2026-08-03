import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import userRouter from './routers/user.router.js';
import { errorHandler } from './middlewares/error-handler.js';
import { routeNotFound } from './middlewares/route-not-found.js';
import { eventTypeRouter } from './routers/event-type.router.js';
import { publicEventRouter } from './routers/public-event-type.router.js';
import { availabilityRouter } from './routers/availability.router.js';
import { bookingRouter } from './routers/booking.router.js';
import { googleIntegrationRouter } from './routers/google.router.js';
import { swaggerSpec } from './config/swagger.js';

const app: Express = express();

app.use(express.json()); // deserialize json body to javascript object.
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API server is running
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok!',
    timestamp: new Date().toISOString()
  })

});

app.use("/api/users", userRouter);
app.use("/api/event-types", eventTypeRouter);
app.use('/api/availability', availabilityRouter);
app.use("/api/bookings", bookingRouter);
app.use('/api/public', publicEventRouter);
app.use('/api/integrations/google', googleIntegrationRouter);

app.use(routeNotFound);
app.use(errorHandler);

export { app };
