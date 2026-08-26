import "dotenv/config";
import express from "express";
import connectDB from "./config/mongoose.js";
import { connectRedis } from "./config/redis.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRouter.js";
import messageRouter from "./routes/messageRouter.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/msg", messageRouter);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    app.listen(process.env.PORT, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
