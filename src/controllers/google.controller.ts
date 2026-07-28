import { Request, Response } from "express";
import { badRequest } from "../utils/api-error.js";
import { exchangeSetupCode } from "../services/google-calendar.service.js";
import { sendSuccess } from "../utils/api-response.js";

export const setupGoogleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;
    if (!code) {
        throw badRequest("Missing code");
    }
    const { refreshToken, email } = await exchangeSetupCode(code);

    sendSuccess(
        res,
        { refreshToken, email },
        200,
        "Google calendar setup successfully",
    );
};
