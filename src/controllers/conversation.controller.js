import Conversation from "../models/conversation.model.js";
import ConversationMember from "../models/conversationMember.model.js";
import User from "../models/user.model.js";

const createConversation = async (req, res) => {
  try {
    const { userIds, name, avatar } = req.body;
    const type = userIds.length > 1 ? "group" : "private";
    if (type === "private") {
      const existingConv = await ConversationMember.findOne({
        _userId: req._userId,
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
    const allUserIds = [...userIds, req._userId];
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
          role: userId === req._userId ? "admin" : "participant",
        }),
      ),
    );
    return res.status(200).json({ message: "conversation created" });
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const addMemberToConversation = async (req, res) => {
  try {
    const { memberId, convId } = req.body;

    const requester = await ConversationMember.findOne({
      _convId: convId,
      _userId: req._userId,
    });
    if (!requester || requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admin can perform this operation" });
    }
    //check if the conversation already exists
    const conv = await Conversation.findOne({
      _id: convId,
    });
    if (!conv) {
      return res
        .status(404)
        .json({ message: "the conversation does not exist" });
    }
    //check if the conversation is a group
    if (conv.type === "private") {
      res.status(400).json({ message: "you can only add members to groups." });
    }
    //check if the user is already in the conversation
    const existingUser = await ConversationMember.findOne({
      _convId: convId,
      _userId: memberId,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "the user is already in this conversation" });
    }
    await ConversationMember.create({
      _convId: convId,
      _userId: memberId,
      role: "participant",
    });
    return res.status(200).json({ message: "user added" });
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const deleteMemberFromConv = async (req, res) => {
  try {
    const { memberId, convId } = req.body;
    const requester = await ConversationMember.findOne({
      _convId: convId,
      _userId: req._userId,
    });
    if (!requester || requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only admin can perform this operation" });
    }
    //check if the conversation already exists
    const conv = await Conversation.findOne({
      _id: convId,
    });
    if (!conv) {
      return res
        .status(404)
        .json({ message: "the conversation does not exist" });
    }
    const deletedUser = await ConversationMember.findOne({
      _convId: convId,
      _userId: memberId,
    });
    if (!deletedUser) {
      return res.status(404).json({ message: "user could not be found" });
    }
    deletedUser.isMemberDeleted = true;
    await deletedUser.save();
    return res.status(200).json({ message: "user removed" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { convId } = req.body;
    const requesterId = req._userId;
    const convMember = await ConversationMember.findOne({
      _convId: convId,
      _userId: requesterId,
    });
    if (!convMember) {
      return res.status(400).json({
        message:
          "the user is not part of this conversation or the conversation does not exist",
      });
    }
    if (convMember.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only the admin can perform this operation" });
    }
    const conversation = await Conversation.findOne({
      _id: convId,
    });
    const convMembers = await ConversationMember.find({
      _convId: convId,
    });
    conversation.isDeleted = true;
    await conversation.save();
    await Promise.all(
      convMembers.map(async (convMember) => {
        convMember.isMemberDeleted = true;
        convMember.isConvDeleted = true;
        await convMember.save();
      }),
    );
    return res.status(200).json({ message: "conversation deleted" });
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const getConversation = async (req, res) => {
  const userId = req._userId;
  const convIds = await ConversationMember.find({
    _userId: userId,
  });
  if (!convIds) {
    res.status(400).json({ message: "no conversation found" });
  }

  convIds.map((conv) => {
    console.log("conversation: " + conv._convId);
  });
  return res.status(200).json({ message: "conversations found" });
};

const getMembersOfConv = async (req, res) => {
  try {
    const { convId } = req.body;
    const requesterId = req._userId;
    const convMember = await ConversationMember.findOne({
      _convId: convId,
      _userId: requesterId,
    });
    if (!convMember) {
      return res
        .status(403)
        .json({ message: "the user is not part of this conversation" });
    }
    const membersOfConv = await ConversationMember.find({
      _convId: convId,
    });
    const members = await Promise.all(
      membersOfConv.map(async (member) => {
        const user = await User.findOne({
          _id: member._userId,
        });
        if (!member.isMemberDeleted) {
          return {
            _userId: user._id,
            username: user.username,
          };
        }
      }),
    );
    return res.status(200).json(members.filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

export {
  createConversation,
  addMemberToConversation,
  deleteMemberFromConv,
  deleteConversation,
  getConversation,
  getMembersOfConv,
};
