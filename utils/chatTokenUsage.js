export const addChatTokenUsage = async (chat, usage) => {
  chat.usage.totalTokens += parseInt(usage.totalTokens);
  chat.usage.promptTokens += parseInt(usage.promptTokens);
  chat.usage.completionTokens += parseInt(usage.completionTokens);
  await chat.save();
};
