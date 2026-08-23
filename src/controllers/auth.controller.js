import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.utils.js";
import RefreshToken from "../models/refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { username, email, password, avatar, status, isVerified, lastSeen } =
      req.body;

    const userAlreadyExists =
      (await User.findOne({ email })) || (await User.findOne({ username }));
    if (userAlreadyExists) {
      return res.status(400).json({ message: "user already exists" });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      avatar,
      status,
      isVerified,
      lastSeen,
    });

    res.status(201).json({ message: "user created" });
  } catch (error) {
    res.status(500).json({ message: "erreur serveur " + error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user could not be found" });
    }
    if (!(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "incorrect password" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await RefreshToken.create({
      _userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });

    return res
      .status(200)
      .json({ message: "acccess granted", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "server error" + error.message });
  }
};

const renewAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenInDb) {
      return res.status(401).json({ message: "refresh token not in db" });
    }
    const newAccessToken = generateAccessToken(decoded.userId);

    return res
      .status(200)
      .json({ message: "access token renewed", accessToken: newAccessToken });
  } catch (error) {
    console.log("error : ", error.message);

    return res.status(401).json({ message: "refresh token expired" });
  }
};

export { register, login, renewAccessToken };
