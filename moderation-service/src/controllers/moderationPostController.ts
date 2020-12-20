import { asyncWrapper, Status } from "@marius98/common";
import mongoose, { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import Following from "../models/followingModel";
import Post from "../models/postModel";

export const getMyFollowerAndFollowingsPosts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let followingsAndFollowers: string[] = [];

    const followings = await Following.find({
      follower: req.user._id,
      status: Status.Accepted,
    });
    const followers = await Following.find({
      followingUser: req.user._id,
      status: Status.Accepted,
    });

    const myPosts = await Post.find({ user: req.user._id }).populate({
      path: "user",
      select: "name lastname photo",
    });

    followings.forEach((following) => {
      followingsAndFollowers.push(following.followingUser);
    });
    followers.forEach((follower) => {
      if (!followingsAndFollowers.includes(follower.follower))
        followingsAndFollowers.push(follower.follower);
    });

    const posts = await Post.find({
      user: {
        $in: followingsAndFollowers,
      },
    }).populate({
      path: "user",
      select: "name lastname photo",
    });

    const totalPosts = [...posts, ...myPosts];

    res.status(200).json({
      status: "success",
      results: totalPosts.length,
      data: totalPosts,
    });
  }
);

export const getMyPosts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const myPosts = await Post.find({
      user: req.user._id,
    });

    res.status(200).json({
      status: "success",
      results: myPosts.length,
      data: myPosts,
    });
  }
);
