import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import userRouter from "./routes/userRoutes";
import globalErrorHandler from "./controllers/errorController";
import { natsWrapper } from "./natsWrapper";

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

(async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is not defined!");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is not defined!");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is not defined!");
  }

  mongoose.connect(
    "mongodb://mongo-cluster-ip:27017/users",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("Authentication Database connected successfully!");
    }
  );

  try {
    await natsWrapper.connect({
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      connectionUrl: process.env.NATS_URL,
    });

    natsWrapper.stan.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.stan.close());
    process.on("SIGTERM", () => natsWrapper.stan.close());
  } catch (error) {
    console.error(error);
  }
})();

export default app;
