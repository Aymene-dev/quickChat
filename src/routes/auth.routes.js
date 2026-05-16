import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { userValidator } from "../validators/user.validator.js";

const router = express.Router();

router.post("/register", userValidator, register);

router.post("/login", login);

export default router;
