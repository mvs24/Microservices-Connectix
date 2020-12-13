import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError, globalErrorHandler } from "@marius98/common";

import commentRouter from "./routes/commentRoutes";
import { natsWrapper } from "./natsWrapper";
import { PostCreatedListener } from "./events/listeners/PostCreatedListener";
import { PostDeletedListener } from "./events/listeners/PostDeletedListener";
import { PostUpdatedListener } from "./events/listeners/PostUpdatedListener";

const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.use("/api/comments", commentRouter);

app.all("*", (_req: Request, _res: Response, next: NextFunction) => {
  return next(new AppError("This route is not yet defined", 400));
});

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

  try {
    await mongoose.connect("mongodb://mongo-cluster-ip:27017/comments", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log("Comment Database connected successfully!");

    await natsWrapper.connect({
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      connectionUrl: process.env.NATS_URL,
    });

    new PostCreatedListener(natsWrapper.stan).listen();
    new PostDeletedListener(natsWrapper.stan).listen();
    new PostUpdatedListener(natsWrapper.stan).listen();

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