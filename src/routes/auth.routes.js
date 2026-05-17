import express from "express";
import {
  register,
  login,
  renewAccessToken,
} from "../controllers/auth.controller.js";
import { userValidator } from "../validators/user.validator.js";
import { checkAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", userValidator, register);

router.post("/login", login);

router.post("/refresh", renewAccessToken);

router.get("/test-access", checkAccessToken, (req, res) => {
  res.status(200).json({ message: "access granted", userId: req._userId });
});

export default router;
