import gemini from "../config/gemini.js";

export const generateTitle = async firstMessage => {
  const result = await gemini.interactions.create({
    model: process.env.GEMINI_NO_THINKING_MODEL,
    system_instruction: `With the given message, create a small title for this message, with maximum length of 6 words,`,
    input: firstMessage,
  });

  if (!result) {
    throw new Error("No response from the title service");
  }

  return {
    output: result.output_text,
    usage: {
      totalTokens: parseInt(result.usage?.total_tokens),
      promptTokens: parseInt(result.usage?.total_input_tokens),
      completionTokens: parseInt(result.usage?.total_output_tokens),
    },
  };
};
