import User from "../models/user.model.js";

const getUsers = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.findOne({
      _id: { $ne: req._userId },
      username: { $regex: username, $options: "i" },
    }).select("_id username avatar");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export { getUsers };
