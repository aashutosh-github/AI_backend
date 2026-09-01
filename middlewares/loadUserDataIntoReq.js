import User from "../model/userSchema.js";

const loadUserDataIntoReq = async (req, res, next) => {
  try {
    const payload = req.tokenPayload;

    const user = await User.findById(payload.id).select("-password");
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
