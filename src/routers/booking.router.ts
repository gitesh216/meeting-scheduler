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

bookingRouter.get("/", validateQuery(listHostBookingsQuerySchema), list);
bookingRouter.post("/pessimistic", validate(createBookingSchema), create1);
bookingRouter.post("/optimistic", validate(createBookingSchema), create2);
bookingRouter.delete("/:bookingId", remove);
