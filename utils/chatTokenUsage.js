export const addChatTokenUsage = async (chat, usage) => {
  chat.usage.totalTokens += usage.total_tokens;
  chat.usage.promptTokens += usage.total_input_tokens;
  chat.usage.completionTokens += usage.total_output_tokens;
  await chat.save();
};
