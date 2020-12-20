import { protect } from "@marius98/common";
import express from "express";

import * as moderationPostController from "../controllers/moderationPostController";

const router = express.Router();

router.use(protect);

router.get("/my-posts", moderationPostController.getMyPosts);
router.get("/posts", moderationPostController.getMyFollowerAndFollowingsPosts);

export default router;
