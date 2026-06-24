import { Request, Response } from "express";
import {
    findAllUsers as findAllUsersService,
    findUserById as findUserByIdService,
} from "../services/user.service.js";
import { badRequest } from "../utils/api-error.js";
import { sendSuccess } from "../utils/api-response.js";

export async function getAllUsers(_req: Request, res: Response) {
    const response = await findAllUsersService();
    sendSuccess(res, response);
}

export async function getUser(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
        throw badRequest("User id is required");
    }
    const user = await findUserByIdService(Number(userId));
    sendSuccess(res, user);
}
