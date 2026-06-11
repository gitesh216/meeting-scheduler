import { Request, Response } from "express";
import { findAllUsers as findAllUsersService } from "../services/user.service.js";

export async function getAllUsers(_req: Request, res: Response) {
    try {
        const users = await findAllUsersService();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}