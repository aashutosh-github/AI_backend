export const resetTokenIfNeeded = async user => {
  const nowTime = new Date();
  if (nowTime >= user.usage.resetAt) {
    user.usage.tokenUsed = 0;
    user.usage.tokenLimit = new Date(Date.now() + 5 * 60 * 60 * 1000);
    await user.save();
  }
};

export const hasTokenLimitReached = user => {
  return user.usage.tokenUsed >= user.usage.tokenLimit;
};

export const addUserTokenUsage = async (user, token) => {
  user.usage.tokenUsed += token;
  user.usage.totalTokenUsed += token;
};
