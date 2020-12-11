import { protect } from "@marius98/common";
import express from "express";

import * as postController from "../controllers/postController";

const router = express.Router();

router.route("/").get(protect, postController.createPost);

export default router;
