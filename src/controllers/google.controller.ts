import { Request, Response } from "express";
import { badRequest } from "../utils/api-error.js";
import {
    exchangeSetupCode,
    getSetupAuthUrl,
    getGoogleCalendarStatus,
} from "../services/google-calendar.service.js";
import { sendSuccess } from "../utils/api-response.js";

export const setupGoogleAuthUrl = async (req: Request, res: Response) => {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
        throw badRequest("Missing x-user-id header");
    }

    const url = await getSetupAuthUrl(userId); // now async

    sendSuccess(res, { url }, 200, "Google auth URL generated");
};

export const setupGoogleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;

    if (!code) {
        throw badRequest("Missing code");
    }
    if (!state) {
        throw badRequest("Missing state");
    }

    const { email } = await exchangeSetupCode(state, code);

    sendSuccess(res, { email }, 200, "Google calendar connected successfully");
};

export const getGoogleCalendarStatusHandler = async (
    req: Request,
    res: Response,
) => {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
        throw badRequest("User id is required");
    }

    const status = await getGoogleCalendarStatus(userId);
    sendSuccess(res, status, 200, "Google calendar status retrieved");
};
