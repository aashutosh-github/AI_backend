import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);
userRouter.post("/login", userController.logIn);
userRouter.get("/profile", authMiddleware, userController.profile);
userRouter.post("/logout", authMiddleware, userController.logOut);
userRouter.delete("/delete", authMiddleware, userController.deleteProfile);

export default userRouter;
