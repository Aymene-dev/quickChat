import express from "express";
import { register } from "../controllers/auth.controller.js";
import { userValidator } from "../validators/user.validator.js";

const router = express.Router();

router.post("/register", userValidator, register);

export default router;
