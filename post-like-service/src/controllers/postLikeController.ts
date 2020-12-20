import { asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import PostLike from "../models/postLikeModel";

export const toggleLike = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const postLike = await PostLike.findOne({
      user: req.user._id,
      post: id,
    });

    if (!postLike) {
      const createdPostLike = PostLike.build({
        user: req.user._id,
        post: id,
      });

      await createdPostLike.save();

      res.status(201).json({
        status: "success",
        data: createdPostLike,
      });
    } else {
      await postLike.remove();

      res.status(204).json({
        status: "success",
        data: postLike,
      });
    }
  }
);

export const getLikes = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const likes = await PostLike.find({
      post: id,
    }).populate({
      path: "user",
      select: "name lastname photo",
    });

    res.status(200).json({
      status: "success",
      results: likes.length,
      data: likes,
    });
  }
);
