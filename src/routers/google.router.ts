import { Router } from "express";
import {
    setupGoogleCallback,
    setupGoogleAuthUrl,
    getGoogleCalendarStatusHandler,
    disconnectGoogleCalendarHandler
} from "../controllers/google.controller.js";

export const googleIntegrationRouter: Router = Router();

googleIntegrationRouter.get("/google-calendar/connect", setupGoogleAuthUrl);
googleIntegrationRouter.get("/callback", setupGoogleCallback);
googleIntegrationRouter.get(
    "/google-calendar/status",
    getGoogleCalendarStatusHandler,
);
googleIntegrationRouter.delete("/google-calendar/disconnect", disconnectGoogleCalendarHandler);
