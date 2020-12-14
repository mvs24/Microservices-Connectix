import { protect } from "@marius98/common";
import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:resetToken", authController.resetPassword);

router
  .route("/me")
  .get(protect, userController.getMe)
  .patch(protect, userController.updateMe);

export default router;
