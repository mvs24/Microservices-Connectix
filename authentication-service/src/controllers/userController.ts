import { NextFunction, Request, Response } from "express";

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
};
