import express from "express";

import * as commentController from "../controllers/commentController";

const router = express.Router();

router.route("/").post(commentController.createComment);

export default router;
