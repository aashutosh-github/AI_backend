import mongoose from "mongoose";
import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";

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

    const userMessage = await Message.create({
      userId: req.user.id,
      chatId: chat._id,
      role: "user",
      content: content.trim(),
    });

    // send this content to our AI model
    // dummy reply for now
    const dummyReply = "Oye Balle Balle";

    const modelMessage = await Message.create({
      userId: req.user.id,
      chatId: chat._id,
      role: "model",
      content: dummyReply,
    });

    chat.messageCount += 2;

    if (chat.topic === "New Chat") {
      chat.topic = content.trim().slice(0, 30);
    }

    await chat.save();

    return res.status(201).json({ message: modelMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
