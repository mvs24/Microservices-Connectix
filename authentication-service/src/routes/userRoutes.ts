import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.signup);

export default router;
