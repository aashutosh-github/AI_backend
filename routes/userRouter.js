import express from "express";
import authMiddleware from "../middlewares/authUserMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", logIn);
userRouter.post("/profile", authMiddleware, profile);
userRouter.post("/logout", logOut);

export default userRouter;
