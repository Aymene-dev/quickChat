import express from "express";
import { body, validationResult } from "express-validator";

export const userValidator = [
  body("username").notEmpty().withMessage("username is required"),
  body("email").notEmpty().isEmail().withMessage("email is required"),
  body("password").notEmpty().withMessage("password required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];
