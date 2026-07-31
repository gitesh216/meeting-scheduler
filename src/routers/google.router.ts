import { Router } from "express";
import {
    setupGoogleCallback,
    setupGoogleAuthUrl,
    getGoogleCalendarStatusHandler,
} from "../controllers/google.controller.js";

export const googleIntegrationRouter: Router = Router();

googleIntegrationRouter.get("/google-calendar/connect", setupGoogleAuthUrl);
googleIntegrationRouter.get("/callback", setupGoogleCallback);
googleIntegrationRouter.get(
    "/google-calendar/status",
    getGoogleCalendarStatusHandler,
);
