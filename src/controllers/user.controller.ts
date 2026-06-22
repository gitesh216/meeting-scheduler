import { Request, Response } from "express";
import {
    findAllUsers as findAllUsersService,
    findUserById,
} from "../services/user.service.js";
import { badRequest, internalServerError } from "../utils/api-error.js";

export async function getAllUsers(_req: Request, res: Response) {
    try {
        const users = await findAllUsersService();
        res.json(users);
    } catch (error) {
        throw internalServerError();
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw badRequest("User id is required");
        }
        const user = await findUserById(Number(userId));
        return res.json(user);
    } catch (error) {
        console.log("User by id not found", error);
    }
}
