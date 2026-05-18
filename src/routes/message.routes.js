import express from "express";
import {
  sendMessage,
  deleteMessage,
  updateMessage,
  getMessages,
} from "../controllers/message.controller.js";
import messageValidator from "../validators/message.validator.js";
import { checkAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", checkAccessToken, messageValidator, sendMessage);
router.delete("/delete", checkAccessToken, deleteMessage);
router.put("/update", checkAccessToken, updateMessage);
router.get("/recover", checkAccessToken, getMessages);

export default router;
