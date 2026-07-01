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

eventTypeRouter.get("/", requireUserId, list);
eventTypeRouter.get("/:id", requireUserId, getById);
eventTypeRouter.post(
    "/",
    requireUserId,
    validate(createEventTypeSchema),
    create,
);
eventTypeRouter.patch(
    "/:id",
    requireUserId,
    validate(UpdateEventTypeSchema),
    update,
);
eventTypeRouter.delete("/:id", requireUserId, remove);
