import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as chatController from "../controllers/chatControllers.js";

const chatRouter = express.Router();

chatRouter.use(authMiddleware);

chatRouter.post("/create", chatController.createChat);
chatRouter.get("/recents", chatController.getRecentChats);
chatRouter.delete("/:chatId", chatController.deleteChat);
chatRouter.get("/:chatId", chatController.getSingleChat);

export default chatRouter;
