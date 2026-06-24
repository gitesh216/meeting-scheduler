import { Request, Response } from "express";
import {
    createNewUser as createUserService,
    findAllUsers as findAllUsersService,
    findUserById as findUserByIdService,
} from "../services/user.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function findAllUsers(_req: Request, res: Response) {
    const response = await findAllUsersService();
    sendSuccess(res, response);
}

export async function findById(req: Request, res: Response) {
    const { userId } = req.params;

    const user = await findUserByIdService(Number(userId));
    sendSuccess(res, user);
}

export async function createUser(req: Request, res: Response) {
    const newUser = await createUserService(req.body);
    sendSuccess(res, newUser, 201, "User created successfully");
}
