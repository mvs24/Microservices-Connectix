import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError, globalErrorHandler } from "@marius98/common";

import { natsWrapper } from "./natsWrapper";
import postLikeRouter from "./routes/postLikeRoutes";
import { PostCreatedListener } from "./events/listeners/PostCreatedListener";
import { PostUpdatedListener } from "./events/listeners/PostUpdatedListener";
import { PostDeletedListener } from "./events/listeners/PostDeletedListener";
import { UserCreatedListener } from "./events/listeners/UserCreatedListener";
import { UserUpdatedListener } from "./events/listeners/UserUpdatedListener";

const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.use("/api/postLikes", postLikeRouter);

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
    let uriConnection: string =
      process.env.NODE_ENV === "development"
        ? "mongodb://host.docker.internal:27017/connectixPostLikes"
        : "mongodb://mongo-cluster-ip:27017/postLikes";

    await mongoose.connect(uriConnection, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Post Like Database connected successfully!");

    await natsWrapper.connect({
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      connectionUrl: process.env.NATS_URL,
    });

    natsWrapper.stan.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new PostCreatedListener(natsWrapper.stan).listen();
    new PostUpdatedListener(natsWrapper.stan).listen();
    new PostDeletedListener(natsWrapper.stan).listen();
    new UserCreatedListener(natsWrapper.stan).listen();
    new UserUpdatedListener(natsWrapper.stan).listen();

    process.on("SIGINT", () => natsWrapper.stan.close());
    process.on("SIGTERM", () => natsWrapper.stan.close());
  } catch (error) {
    console.error(error);
  }
})();

export default app;
