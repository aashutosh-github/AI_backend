import mongoose from "mongoose";
import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";
import {
  resetTokenIfNeeded,
  hasTokenLimitReached,
  addUserTokenUsage,
} from "../utils/userUsage.js";
import { addChatTokenUsage } from "../utils/chatTokenUsage.js";
import { buildContextForAi } from "../utils/buildContext.js";
import { generateAiResponse } from "../service/geminiService.js";
import { updateSummaryIfNeeded } from "../service/summaryService.js";

export const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({ message: "No such chat found" });
    }

    const returnedMessages = await Message.find({
      userId: req.user.id,
      chatId: chatId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages: returnedMessages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Data not provided" });
    }

    await resetTokenIfNeeded(req.user);

    if (hasTokenLimitReached(req.user)) {
      return res.status(429).json({
        message: `Token limit exceeded`,
        usage: req.user.usage,
      });
    }

    let chat;

    if (chatId) {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Incorrect format of chat id" });
      }
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      chat = await Chat.create({ userId: req.user.id });
    }

    const messagesToBeSent = await Message.find({ chatId })
      .sort({ updatedAt: 1 })
      .skip(chat.summarizedTillMessageNumber);

    const messages = buildContextForAi(chat, messagesToBeSent, content.trim());

    const aiReply = await generateAiResponse(messages);

    const userMessage = await Message.create({
      userId: req.user.id,
      chatId: chat._id,
      role: "user_input",
      content: content.trim(),
    });

    const modelMessage = await Message.create({
      userId: req.user.id,
      chatId: chat._id,
      role: "model_output",
      content: aiReply,
    });

    chat.messageCount += 2;

    if (chat.topic === "New Chat" && chat.messageCount >= 2) {
      chat.topic = content.trim().slice(0, 30);
    }

    await addChatTokenUsage(chat, aiReply.usage);
    await addUserTokenUsage(req.user, aiReply.usage.totalTokens);
    await chat.save();

    res.status(200).json({
      userMessage,
      modelMessage,
      output: aiReply.modelReply,
    });

    await updateSummaryIfNeeded(chat._id);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
