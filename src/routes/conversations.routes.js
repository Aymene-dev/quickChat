import express from "express";
import {
  createConversation,
  getConversation,
  addMemberToConversation,
  deleteMemberFromConv,
  deleteConversation,
  getMembersOfConv,
} from "../controllers/conversation.controller.js";
import { checkAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createConversation", checkAccessToken, createConversation);
router.post("/addMember", checkAccessToken, addMemberToConversation);
router.delete("/deleteMember", checkAccessToken, deleteMemberFromConv);
router.delete("/deleteConversation", checkAccessToken, deleteConversation);
router.get("/userConvs", checkAccessToken, getConversation);
router.get("/convMembers", checkAccessToken, getMembersOfConv);

export default router;
