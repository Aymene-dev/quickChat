import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
