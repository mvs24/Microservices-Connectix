import { NextFunction, Request, Response } from "express";
import { asyncWrapper, AppError } from "@marius98/common";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import validator from "validator";
import { UserCreatedPublisher } from "../events/UserCreatedPublisher";
import { natsWrapper } from "../natsWrapper";

const signToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_KEY is not defined!");
  }
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET
  );
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
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: "success",
      token,
      user: {
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

    const token = signToken(user._id);

    res.status(201).json({
      status: "success",
      token,
      user: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  }
);
