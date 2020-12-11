import { protect } from "@marius98/common";
import express from "express";

import * as postController from "../controllers/postController";

const router = express.Router();

router
  .route("/")
  .post(protect, postController.createPost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

export default router;
