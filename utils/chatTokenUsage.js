export const addChatTokenUsage = async (chat, usage) => {
  chat.usage.totalTokens += parseInt(usage.totalTokens ?? 0);
  chat.usage.promptTokens += parseInt(usage.promptTokens ?? 0);
  chat.usage.completionTokens += parseInt(usage.completionTokens ?? 0);
  await chat.save();
};
