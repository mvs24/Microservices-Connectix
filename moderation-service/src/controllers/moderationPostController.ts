import { asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";

export const getMyFollowerPosts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
