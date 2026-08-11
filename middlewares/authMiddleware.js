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

    req.user = existingUser;

    return next();
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Please login again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Token was tampered." });
    }
    return res.status(500).json({ message: "Failed to authenticate token" });
  }
};

export default authMiddleware;
