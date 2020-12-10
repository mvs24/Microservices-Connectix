import { protect } from "@marius98/common";
import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/me", protect, authController.getMe);

export default router;
