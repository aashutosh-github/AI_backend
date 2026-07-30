import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await User.findById(payload.id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      name: existingUser.name,
      age: existingUser.age,
      email: existingUser.email,
      usage: existingUser.usage,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
