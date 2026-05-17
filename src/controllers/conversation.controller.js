import Conversation from "../models/conversation.model.js";
import ConversationMember from "../models/conversationMember.model.js";

const createConversation = async (req, res) => {
  try {
    const { userIds, name, avatar } = req.body;
    const type = userIds.length > 1 ? "group" : "private";
    if (type === "private") {
      const existingConv = await ConversationMember.findOne({
        _userId: req.userId,
        _convId: {
          $in: await ConversationMember.find({ _userId: userIds[0] }).distinct(
            "_convId",
          ),
        },
      });
      if (existingConv) {
        return res.status(400).json({ message: "conversation already exists" });
      }
    }
    const allUserIds = [...userIds, req.userId];
    const newConv = await Conversation.create({
      type,
      name,
      avatar,
    });
    await Promise.all(
      allUserIds.map((userId) =>
        ConversationMember.create({
          _convId: newConv._id,
          _userId: userId,
          role: userId === req.userId ? "admin" : "participant",
        }),
      ),
    );
    return res.status(200).json({ message: "conversation created" });
  } catch (error) {
    return res.status(500).json({ message: "server error" + error.message });
  }
};

const addMemberToConversation = async (req, res) => {};
