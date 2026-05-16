import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
