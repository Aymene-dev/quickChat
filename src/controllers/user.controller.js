import User from "../models/user.model.js";

const getUsers = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.find({
      _id: { $ne: req._userId },
      username: { $regex: username, $options: "i" },
    }).select("_id username avatar");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

const searchOneUser = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({
      username,
    }).select("username");
    if (user) return res.status(200).json({ availability: false });
    else return res.status(200).json({ availability: true });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({
      email,
    }).select("email");
    if (user) return res.status(200).json({ availability: false });
    else return res.status(200).json({ availability: true });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export { getUsers, searchOneUser, checkEmailAvailability };
