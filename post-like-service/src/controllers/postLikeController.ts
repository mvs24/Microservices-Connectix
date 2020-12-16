import { asyncWrapper } from "@marius98/common";
import { NextFunction, Request, Response } from "express";

export const addLike = asyncWrapper(
  (req: Request, res: Response, next: NextFunction) => {}
);
