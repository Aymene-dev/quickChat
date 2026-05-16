import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.utils.js";

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

export { register };
