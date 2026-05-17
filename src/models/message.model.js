import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    _convId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: true,
    },
    _userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
