import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import ConversationMember from "../models/conversationMember.model.js";
import User from "../models/user.model.js";
import { login } from "./auth.controller.js";
import { getIO } from "../utils/socket.utils.js";

const sendMessage = async (req, res) => {
  try {
    const { convId, content } = req.body;
    const senderId = req._userId;
    //get the conversation
    const conv = await Conversation.findOne({
      _id: convId,
    });
    if (!conv) {
      return res
        .status(400)
        .json({ message: "the conversation does not exist" });
    }
    //check if the sender is part of the conversation
    const isSenderInConv = await ConversationMember.findOne({
      _convId: convId,
      _userId: senderId,
    });
    if (!isSenderInConv) {
      return res
        .status(400)
        .json({ message: "the user is not part of the conversation" });
    }
    await Message.create({
      _convId: convId,
      _userId: senderId,
      content,
      isDeleted: false,
    });
    conv.updatedAt = Date.now();
    await conv.save();
    const sender = await User.findOne({
      _id: senderId,
    }).select("_id username avatar");
    const io = getIO();
    io.to(convId).emit("newMessage", {
      sender: sender.username,
      senderId: sender._id,
      content,
      updatedAt: new Date(),
    });
    const members = await ConversationMember.find({ _convId: convId });
    members.forEach((member) => {
      io.to(member._userId.toString()).emit("convUpdated", { convId });
    });
    return res.status(200).json({ message: "message sent" });
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const senderId = req._userId;
    //get the message
    const message = await Message.findOne({
      _id: messageId,
    });
    if (!message) {
      return res.status(400).json({ message: "message does not exist" });
    }
    //check if the provided id is the real sender
    if (message._userId.toString() !== senderId) {
      return res
        .status(403)
        .json({ message: "only the sender can delete a message" });
    }
    //check if the message is already deleted
    if (message.isDeleted) {
      return res
        .status(400)
        .json({ message: "the message has already been deleted" });
    }
    //update the message
    message.isDeleted = true;
    await message.save();
    return res.status(200).json({ message: "message deleted" });
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;
    const senderId = req._userId;
    //get the message
    const message = await Message.findOne({
      _id: messageId,
    });
    if (!message) {
      return res.status(400).json({ message: "message does not exist" });
    }
    //check if the provided id is the real sender
    if (message._userId.toString() !== senderId) {
      return res
        .status(403)
        .json({ message: "only the sender can delete a message" });
    }
    if (content !== "") {
      message.content = content;
      await message.save();
      return res.status(200).json({ message: "message updated" });
    } else {
      return res.status(403).json({ message: "message can not be empty" });
    }
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { convId } = req.query;
    const requesterId = req._userId;
    const requester = await User.findOne({
      _id: requesterId,
    });

    //check if the conversation exists
    const conversation = await Conversation.findOne({
      _id: convId,
    });
    if (!conversation || conversation.isDeleted) {
      return res.status(400).json({
        message: "the conversation does not exist (or has been deleted)",
      });
    }
    const convMember = await ConversationMember.findOne({
      _convId: conversation._id,
      _userId: requester._id,
    });
    if (!convMember) {
      return res
        .status(403)
        .json({ message: "the user is not part of the conversation" });
    }
    //get all the messages from the conversation
    const messages = await Message.find({
      _convId: convId,
    });
    const result = await Promise.all(
      messages.map(async (message) => {
        if (message.isDeleted === false) {
          let sender;
          if (message._userId.toString() === requesterId) {
            sender = "You";
          } else {
            sender = await User.findOne({
              _id: message._userId,
            });
            sender = sender.username;
          }
          return {
            sender,
            content: message.content,
            updatedAt: message.updatedAt,
          };
        }
      }),
    );
    return res.status(200).json(result.filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: "server error " + error.message });
  }
};

const getLastMessage = async (req, res) => {
  try {
    const { convId } = req.query;
    const requesterId = req._userId;
    const requester = await User.findOne({
      _id: requesterId,
    });

    const conversation = await Conversation.findOne({
      _id: convId,
    });
    if (!conversation || conversation.isDeleted) {
      return res.status(400).json({
        message: "the conversation does not exist (or has been deleted)",
      });
    }
    const convMember = await ConversationMember.findOne({
      _convId: conversation._id,
      _userId: requester._id,
    });
    if (!convMember) {
      return res
        .status(403)
        .json({ message: "the user is not part of the conversation" });
    }
    const lastMessage = await Message.findOne({ _convId: convId }).sort({
      _id: -1,
    });
    if (!lastMessage) {
      return res.status(200).json({ lastMessage: { data: { content: null } } });
    }
    return res.status(200).json(lastMessage);
  } catch (error) {
    return res.status(500).json({ message: "error: " + error.message });
  }
};

export {
  sendMessage,
  deleteMessage,
  updateMessage,
  getMessages,
  getLastMessage,
};
