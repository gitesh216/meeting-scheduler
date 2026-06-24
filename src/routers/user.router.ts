import { Router } from "express";
import { createUser, deleteUser, findAllUsers, findById, updateUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema } from "../dtos/user.dto.js";

const userRouter: Router = Router();

userRouter.get("/", findAllUsers);

userRouter.get("/:id", findById);

userRouter.post("/", validate(createUserSchema), createUser);

userRouter.patch("/:id", validate(createUserSchema), updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;