import express from "express";
import {
  getUsers,
  searchOneUser,
  checkEmailAvailability,
} from "../controllers/user.controller.js";
import { checkAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/search", checkAccessToken, getUsers);
router.get("/search-one", searchOneUser);
router.get("/check-email", checkEmailAvailability);

export default router;
