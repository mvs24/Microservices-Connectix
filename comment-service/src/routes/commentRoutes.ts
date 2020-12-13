import { protect } from "@marius98/common";
import express from "express";

import * as commentController from "../controllers/commentController";
import Post from "../models/postModel";

const router = express.Router();

router.route("/").post(protect, commentController.createComment);

router
  .route("/:id")
  .patch(protect, commentController.updateComment)
  .delete(protect, commentController.deleteComment);

router.get("/posts", async (req, res, next) => {
  const posts = await Post.find();
  res.send(posts);
});

export default router;
