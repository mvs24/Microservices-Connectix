import { AppError, asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import { UserUpdatedPublisher } from "../events/publishers/UserUpdatedPublisher";
import User, { UserDocument } from "../models/userModel";
import { natsWrapper } from "../natsWrapper";

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
};

export const getAllUsers = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.send(users);
  }
);

export const updateMe = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, lastname, email, photo, profile } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError("You are not part of the application!", 400));
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.profile = profile || user.profile;
    user.photo = photo || user.photo || "a";
    await user.save();

    new UserUpdatedPublisher(natsWrapper.stan).publish({
      id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      version: user.version,
      profile: user.profile,
      photo: user.photo,
    });

    res.status(200).json({
      status: "success",
      data: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  }
);
