import { AppError, asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import { CommentCreatedPublisher } from "../events/publishers/CommentCreatedPublisher";
import Comment from "../models/commentModel";
import Post from "../models/postModel";
import { natsWrapper } from "../natsWrapper";

export const createComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content, post } = req.body;

    if (!content || !post) {
      return next(new AppError("Content and post must be defined", 400));
    }

    const postExists = await Post.findById(post);
    if (!postExists) {
      return next(
        new AppError("Post with the specified id does not exists", 404)
      );
    }

    const comment = Comment.build({
      user: req.user._id,
      content,
      post,
    });

    await comment.save();

    new CommentCreatedPublisher(natsWrapper.stan).publish({
      id: comment._id,
      user: req.user._id,
      content: comment.content,
      post: comment.post,
    });

    res.status(201).json({
      status: "success",
      data: comment,
    });
  }
);
