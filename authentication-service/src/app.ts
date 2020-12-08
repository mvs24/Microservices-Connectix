import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import userRouter from "./routes/userRoutes";
import globalErrorHandler from "./controllers/errorController";

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

mongoose.connect(
  "mongodb://mongo-cluster-ip:27017/users",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Authentication Database connected successfully!");
  }
);

export default app;
