import express from "express";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", logIn);
userRouter.post("/profile", profile);
userRouter.post("/logout", logOut);

export default userRouter;
