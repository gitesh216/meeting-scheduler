import express, { Express } from 'express';
import userRouter from './routers/user.router.js';
import { errorHandler } from './middlewares/error-handler.js';
import { routeNotFound } from './middlewares/route-not-found.js';
import { eventTypeRouter } from './routers/event-type.router.js';
import { publicEventRouter } from './routers/public-event-type.router.js';
import { availabilityRouter } from './routers/availability.router.js';
import { bookingRouter } from './routers/booking.router.js';

const app: Express = express();

app.use(express.json()); // deserialize json body to javascript object.
app.use(express.text()); 
app.use(express.urlencoded({ extended: true }));

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

app.use(routeNotFound);
app.use(errorHandler);

export { app };