import express from "express";
import {
  createConversation,
  getConversation,
  addMemberToConversation,
  deleteMemberFromConv,
} from "../controllers/conversation.controller.js";
import { checkAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createConversation", checkAccessToken, createConversation);
router.post("/addMember", checkAccessToken, addMemberToConversation);
router.post("/deleteMember", checkAccessToken, deleteMemberFromConv);
router.get("/userConvs", checkAccessToken, getConversation);

export default router;
