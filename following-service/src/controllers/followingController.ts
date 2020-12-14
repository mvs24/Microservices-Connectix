import { AppError, asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import Following from "../models/followingModel";
import User from "../models/userModel";
import { Status } from "../models/followingModel";
import { ProfileState } from "../models/userModel";
import { FollowingCreatedPublisher } from "../events/publishers/FollowingCreatedPublisher";
import { natsWrapper } from "../natsWrapper";
import { FollowingUpdatedPublisher } from "../events/publishers/FollowingUpdatedPublisher";

export const addFollowing = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { followingUserId } = req.params;

    const followingUser = await User.findById(followingUserId);
    if (!followingUser) {
      return next(
        new AppError("The user with the provided id does not exists", 404)
      );
    }

    const following = Following.build({
      follower: req.user._id,
      followingUser: followingUserId,
      followingAt: new Date(),
      status:
        followingUser.profile === ProfileState.Public
          ? Status.Accepted
          : Status.Pending,
    });

    await following.save();

    new FollowingCreatedPublisher(natsWrapper.stan).publish({
      _id: following._id,
      follower: following.follower,
      followingUser: following.followingUser,
      status: following.status,
      version: following.version,
    });

    res.status(201).json({
      status: "success",
      data: following,
    });
  }
);

export const updateFollowing = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { followerId } = req.params;

    const { status } = req.body;

    if (!status) {
      return next(new AppError("Status must be defined", 400));
    }
    if (status !== Status.Accepted && status !== Status.Rejected) {
      return next(
        new AppError("Status must be either Accepted or Rejected", 400)
      );
    }

    const followingDocument = await Following.findOne({
      follower: followerId,
      followingUser: req.user._id,
    });
    if (!followingDocument) {
      return next(
        new AppError("No following document found with the provided data", 404)
      );
    }

    followingDocument.status = status;

    await followingDocument.save();

    new FollowingUpdatedPublisher(natsWrapper.stan).publish({
      _id: followingDocument._id,
      follower: followingDocument.follower,
      followingUser: followingDocument.followingUser,
      status: followingDocument.status,
      version: followingDocument.version,
    });

    res.status(200).json({
      status: "success",
      data: followingDocument,
    });
  }
);

export const getFollowers = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const followers = await Following.find({
      followingUser: req.user._id,
      status: Status.Accepted,
    }).populate("follower");

    res.status(200).json({
      status: "success",
      data: followers,
    });
  }
);

export const getFollowings = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const followings = await Following.find({
      follower: req.user._id,
      status: Status.Accepted,
    }).populate("followingUser");

    res.status(200).json({
      status: "success",
      data: followings,
    });
  }
);
