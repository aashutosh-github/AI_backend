import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";

export const getMessage = async (req, res) => {
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

    const chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const userMessage = await Message.create({
      userId: req.user.id,
      chatId: chat._id,
      role: "user",
      content: content,
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

    return res.status(201).json({ message: dummyReply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
