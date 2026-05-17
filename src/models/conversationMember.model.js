import mongoose from "mongoose";

const converssationMemberSchema = mongoose.Schema(
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
    role: {
      type: String,
      enum: ["participant", "admin"],
      default: "participant",
    },
    lastReadAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const ConversationMember = mongoose.model(
  "ConversationMember",
  converssationMemberSchema,
);

export default ConversationMember;
