import gemini from "../config/gemini.js";
import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";
import User from "../model/userSchema.js";

const systemPrompt = `
You summarize conversations into concise structured outputs.
Always base your answer ONLY on the provided conversation.
Do not describe the task itself.
Do NOT summarize the instructions.
Only summarize the conversation content.
`;

const summaryChunk = 20;

export const updateSummaryIfNeeded = async chatId => {
  const chat = await Chat.findOne({ _id: chatId });
  if (!chat) {
    throw new Error("No such chat found");
  }

  if (chat.messageCount - chat.summarizedTillMessageNumber < summaryChunk) {
    return;
  }

  const messagesToBeSummarized = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .skip(chat.summarizedTillMessageNumber)
    .limit(summaryChunk);

  if (messagesToBeSummarized.length === 0) return;

  const messages = messagesToBeSummarized.map(msg => ({
    content: [{ type: "text", text: msg.content }],
    type: msg.role,
  }));

  const result = await gemini.interactions.create({
    model: process.env.GEMINI_NO_THINKING_MODEL,
    system_instruction: systemPrompt,
    input: messages,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "A summary of provided messages",
          },
        },
        required: ["summary"],
      },
    },
  });

  if (!result || result.status === "incomplete") {
    throw new Error("AI response incomplete");
  }

  const summary = JSON.parse(result.steps?.at(-1)?.content[0]?.text).summary;

  chat.summary = summary;
  chat.summaryUpdatedAt = new Date();
  chat.summarizedTillMessageNumber += messagesToBeSummarized.length;

  chat.usage.totalTokens += result.usage.totalTokens;
  chat.usage.promptTokens += result.usage.total_input_tokens;
  chat.usage.completionTokens += result.usage.total_output_tokens;

  await chat.save();

  const user = await User.findById(chat.userId);
  if (user) {
    user.usage.tokenUsed += result.usage.totalTokens;
    user.usage.totalTokenUsed += result.usage.totalTokens;
    await user.save();
  }
};
