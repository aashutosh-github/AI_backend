export const buildContextForAi = (
  chat,
  chatsToBeSummarized,
  currentMessage,
) => {
  let messages = [];
  if (chat.summary && chat.summary.trim() !== "") {
    messages.push({
      type: "user_input",
      content: [{ type: "text", text: `Summary: ${chat.summary}` }],
    });
  }

  for (const msg of chatsToBeSummarized) {
    messages.push({
      type: msg.role,
      content: [{ type: "text", text: msg.content }],
    });
  }

  messages.push({
    type: "user_input",
    content: [{ type: "text", text: currentMessage.trim() }],
  });

  return messages;
};
