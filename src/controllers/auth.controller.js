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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user can not be found" });
    }
    if (!(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "password incorrect" });
    }
    return res.status(200).json({ message: "acccess granted" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export { register, login };
