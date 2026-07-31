import express from "express";
import authMiddleware from "../middlewares/authUserMiddleware.js";
import * as userController from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);
userRouter.post("/login", userController.logIn);
userRouter.post("/profile", authMiddleware, userController.profile);
userRouter.post("/logout", userController.logOut);

export default userRouter;
