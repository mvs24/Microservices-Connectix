import { AppError, asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import { CommentCreatedPublisher } from "../events/publishers/CommentCreatedPublisher";
import { CommentDeletedPublisher } from "../events/publishers/CommentDeletedPublisher";
import { CommentUpdatedPublisher } from "../events/publishers/CommentUpdatedPublisher";
import Comment from "../models/commentModel";
import Post from "../models/postModel";
import { natsWrapper } from "../natsWrapper";

const controlCommentOwner = (
  commentUserId: string,
  userId: string,
  next: NextFunction
): boolean => {
  if (commentUserId.toString() === userId.toString()) {
    return true;
  }
  return false;
};

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

export const updateComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return next(new AppError("No comment found with that id", 404));
    }

    const isCommentOwner = controlCommentOwner(
      comment.user,
      req.user._id,
      next
    );
    if (!isCommentOwner) {
      return next(
        new AppError("You are not allowed to modify this comment", 403)
      );
    }

    comment.content = content || comment.content;
    await comment.save();

    new CommentUpdatedPublisher(natsWrapper.stan).publish({
      id: comment._id,
      version: comment.version,
      content: comment.content,
    });

    res.status(200).json({
      status: "success",
      data: comment,
    });
  }
);

export const deleteComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return next(new AppError("No comment found with that id", 404));
    }

    const isCommentOwner = controlCommentOwner(
      comment.user,
      req.user._id,
      next
    );
    if (!isCommentOwner) {
      return next(
        new AppError("You are not allowed to modify this comment", 403)
      );
    }

    await comment.remove();

    new CommentDeletedPublisher(natsWrapper.stan).publish({
      id,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
