import { protect } from "@marius98/common";
import express from "express";

import * as commentController from "../controllers/commentController";

const router = express.Router();

router.route("/").post(protect, commentController.createComment);

export default router;
