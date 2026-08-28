import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

const loadUserDataIntoReq = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: `User does not exist` });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
};

export default loadUserDataIntoReq;
