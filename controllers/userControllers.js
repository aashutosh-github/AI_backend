import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const cookiesConfig = {
  httpOnly: true,
  secure: false,
  maxAge: 1000 * 60 * 60,
};

const createToken = (id, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Environment variable not found");
  }
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const signUp = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email or Password is missing" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "These credentials are already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      name,
      age,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "created user successfully",
      user: {
        name: createdUser.name,
        email: createdUser.email,
        age: createdUser.age,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Credentials not provided" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: `Invalid email or password` });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const token = createToken(user._id, user.email);
    res.cookie("token", token, cookiesConfig);

    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        name: user.name,
        age: user.age,
        email: user.email,
        usage: user.usage,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });
    return res.status(200).json("User logged out successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const profile = async (req, res) => {
  try {
    return res.status(200).json({
      name: req.user.name,
      age: req.user.age,
      email: req.user.email,
      usage: req.user.usage,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
