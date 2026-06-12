import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/user.controller.js";

const userRouter: Router = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);

export default userRouter;