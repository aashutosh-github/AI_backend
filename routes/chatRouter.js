import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as chatController from "../controllers/chatControllers.js";

const chatRouter = express.Router();

chatRouter.use(authMiddleware);

chatRouter.post("/createChat", chatController.createChat);
chatRouter.get("/getRecentChats", chatController.getRecentChats);
chatRouter.delete(":chatId", chatController.deleteChat);
chatRouter.get(":chatId", chatController.getSingleChat);

export default chatRouter;
