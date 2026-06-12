import { Request, Response } from "express";
import {
  findAllUsers as findAllUsersService,
  findUserById,
} from "../services/user.service.js";

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await findAllUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("User ID not passed");
    }
    const user = await findUserById(Number(userId));
    return res.json(user);
  } catch (error) {
    console.log("User by id not found", error);
  }
}
