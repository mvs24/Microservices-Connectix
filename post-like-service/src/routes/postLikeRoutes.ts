import { protect } from "@marius98/common";
import express from "express";

import * as postLikeController from "../controllers/postLikeController";

const router = express.Router();

router.route("/:id").post(protect, postLikeController.toggleLike);

export default router;
