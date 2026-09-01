export const addUserTokenUsage = async (user, token) => {
  user.totalTokenUsed += token;
  await user.save();
};
