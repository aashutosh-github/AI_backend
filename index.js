import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/mongoose.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRouter.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/chat", chatRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
