import { redisClient } from "../config/redis.js";

const authenticatedUserRateLimiter = async (req, res, next) => {
  try {
    const payload = req.tokenPayload;
    const key = `rate-limit:user-id:${payload.id}`;

    const limit = await redisClient.incr(key);

    if (limit === 1) {
      await redisClient.expire(key, 60);
    }

    if (limit > 20) {
      const remainingTime = await redisClient.ttl(key);
      return res.status(429).json({
        message: `Too many requests, please try after ${remainingTime} seconds`,
      });
    }

    next();
  } catch (err) {
    console.log(`Authenticated rate limiter error:\n ${err}`);
    next();
  }
};

export default authenticatedUserRateLimiter;
