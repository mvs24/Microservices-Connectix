import { asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";

export const createComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {}
);
