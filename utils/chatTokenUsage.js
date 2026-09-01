export const addChatTokenUsage = async (chat, usage) => {
  chat.totalTokens += parseInt(usage.totalTokens ?? 0);
  await chat.save();
};
