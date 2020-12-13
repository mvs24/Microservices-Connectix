import { protect } from "@marius98/common";
import express from "express";

import * as followingController from "../controllers/followingController";

const router = express.Router();

router
  .route("/:followingUserId")
  .post(protect, followingController.addFollowing);

router.patch("/:followerId", protect, followingController.updateFollowing);

export default router;
