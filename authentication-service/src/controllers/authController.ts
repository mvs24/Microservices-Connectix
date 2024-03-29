import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { asyncWrapper, AppError } from "@marius98/common";
import jwt from "jsonwebtoken";

import { UserDocument } from "../models/userModel";
import User from "../models/userModel";
import validator from "validator";
import { UserCreatedPublisher } from "../events/publishers/UserCreatedPublisher";
import { natsWrapper } from "../natsWrapper";
import { ForgotPasswordPublisher } from "../events/publishers/ForgotPasswordPublisher";

const signToken = (user: UserDocument) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_KEY is not defined!");
  }
  return jwt.sign({ user }, process.env.JWT_SECRET);
};

const validateEmailAndPassword: (
  email: string,
  password: string,
  passwordConfirm: string,
  next: NextFunction,
  passwordConfirmRequired: boolean
) => void = (
  email: string,
  password: string,
  passwordConfirm: string,
  next: NextFunction,
  passwordConfirmRequired: boolean
) => {
  if (!validator.isEmail(email)) {
    return next(
      new AppError("Email is invalid. Plase provide a valid email!", 400)
    );
  }
  if (!password || password.length < 6) {
    return next(new AppError("Password must be more than 6 characters.", 400));
  }

  if (passwordConfirmRequired && password !== passwordConfirm) {
    return next(new AppError("Passwords field do not match!", 400));
  }
};

export const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, lastname, email, password, passwordConfirm } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError("User with this email already exists", 400));
    }

    if (!name || !lastname) {
      return next(new AppError("Please provide your name and lastname", 400));
    }

    validateEmailAndPassword(email, password, passwordConfirm, next, true);

    const user = User.build({
      name,
      lastname,
      password,
      passwordConfirm,
      email,
    });

    await user.save();

    new UserCreatedPublisher(natsWrapper.stan).publish({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      version: user.version,
      id: user._id,
    });

    user.password = "";
    const token = signToken(user);

    res.status(201).json({
      status: "success",
      token,
      data: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  }
);

export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    validateEmailAndPassword(email, password, "", next, false);

    const user = await User.findOne({ email }).select("+password");

    //@ts-ignore
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError("User with this email and password does not exists", 401)
      );
    }

    user.password = "";
    const token = signToken(user);

    res.status(201).json({
      status: "success",
      token,
      data: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
      },
    });
  }
);

export const forgotPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return next(
        new AppError("Email is invalid. Plase provide a valid email!", 400)
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User with this email does not exists!", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await new ForgotPasswordPublisher(natsWrapper.stan).publish({
        resetToken,
        email,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      return next(new AppError("Something went wrong sending the email.", 500));
    }

    res.status(200).json({
      status: "success",
      message: "Reset token sent to email!",
    });
  }
);

export const resetPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;
    const { password, passwordConfirm } = req.body;

    if (!resetToken) {
      return next(new AppError("Please specify reset token.", 400));
    }

    if (!password || !passwordConfirm) {
      return next(
        new AppError("Password and password confirm must be defined", 400)
      );
    }

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return next(new AppError("No user with this reset token found!", 404));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    const token = signToken(user);

    res.status(200).json({
      status: "success",
      token,
      data: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  }
);
