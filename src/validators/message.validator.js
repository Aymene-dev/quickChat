import express from "express";
import { body, validationResult } from "express-validator";

const messageValidator = [
  body("content").notEmpty().withMessage("a message can not be empty"),
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

export default messageValidator;
