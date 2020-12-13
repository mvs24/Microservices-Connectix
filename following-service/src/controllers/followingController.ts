import { AppError, asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import Following from "../models/followingModel";
import User from "../models/userModel";
import { Status } from "../models/followingModel";

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
      status: Status.Pending,
    });

    await following.save();

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
    if (status !== Status.Accepted || status !== Status.Rejected) {
      return next(
        new AppError("Status must be either Accepted or Rejected", 400)
      );
    }
    if (!status) {
      return next(new AppError("Status must be defined", 400));
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

    res.status(200).json({
      status: "success",
      data: followingDocument,
    });
  }
);
