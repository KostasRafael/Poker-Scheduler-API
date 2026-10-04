import express from "express";

import {
  signup,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";

import {
  signupSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", validate(signupSchema, "body"), signup);

router.post("/login", validate(loginSchema, "body"), login);

router.post("/logout", authenticate, logout);

router.get("/me", authenticate, getCurrentUser);

export default router;
