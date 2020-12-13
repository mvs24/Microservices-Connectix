import { asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";

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
