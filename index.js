import express from "express";
import connectDB from "./config/mongoose.js";

const app = express();
app.use(express.json());

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
