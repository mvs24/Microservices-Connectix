import express from "express";

import * as postLikeController from "../controllers/postLikeController";

const router = express.Router();

router.route("/:id").post(postLikeController.addLike);

export default router;
