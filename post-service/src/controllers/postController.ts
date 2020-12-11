import { NextFunction, Request, Response } from "express";
import { APIFeatures, AppError, asyncWrapper } from "@marius98/common";
import Post from "../models/postModel";
import { PostCreatedPublisher } from "../events/publishers/PostCreatedPublisher";
import { natsWrapper } from "../natsWrapper";
import { PostUpdatedPublisher } from "../events/publishers/PostUpdatedPublisher";
import { PostDeletedPublisher } from "../events/publishers/PostDeletedPublisher";

const controlPostOwner = (
  postUserId: string,
  userId: string,
  next: NextFunction
) => {
  if (postUserId.toString() !== userId.toString()) {
    return next(new AppError("You are not allowed to modify this post.", 403));
  }
};

export const getAllPosts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // const features = new APIFeatures(Post.find(), req.query)
    //   .filter()
    //   .select()
    //   .sort()
    //   .paginate();
    // const posts = await features.query;
    // return res.status(200).json({
    //   status: "success",
    //   data: posts,
    // });
  }
);

export const createPost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content, postType } = req.body;
    if (!content || !postType) {
      return next(new AppError("Content and post type must be defined!", 400));
    }

    const post = Post.build({
      content,
      postType,
      user: req.user._id,
    });
    await post.save();

    new PostCreatedPublisher(natsWrapper.stan).publish({
      id: post._id,
      postType: post.postType,
      content: post.content,
      user: req.user._id,
      version: post.version,
      createdAt: post.createdAt,
    });

    return res.status(201).json({
      status: "success",
      data: post,
    });
  }
);

export const updatePost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content, postType } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError("No post found with that id", 404));
    }
    controlPostOwner(post.user, req.user.id, next);

    post.content = content || post.content;
    post.postType = postType || post.postType;
    await post.save();

    new PostUpdatedPublisher(natsWrapper.stan).publish({
      id: post._id,
      postType: post.postType,
      content: post.content,
      user: req.user.id,
      version: post.version,
      createdAt: post.createdAt,
    });

    return res.status(201).json({
      status: "success",
      data: post,
    });
  }
);

export const deletePost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError("No post found with that id", 404));
    }
    controlPostOwner(post.user, req.user.id, next);

    await post.remove();

    new PostDeletedPublisher(natsWrapper.stan).publish({
      id,
    });

    return res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
