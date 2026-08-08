import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as messageController from "../controllers/messageControllers.js";

const messageRouter = express.Router();

messageRouter.use(authMiddleware);

messageRouter.post("/", messageController.sendMessage);
messageRouter.get("/:chatId", messageController.getAllMessages);
messageRouter.post("/:chatId", messageController.sendMessage);

export default messageRouter;
