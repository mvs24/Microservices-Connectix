import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError, globalErrorHandler } from "@marius98/common";

import { natsWrapper } from "./natsWrapper";
import followingRouter from "./routes/followingRoutes";
import { UserCreatedListener } from "./events/listeners/UserCreatedListener";
import { UserUpdatedListener } from "./events/listeners/UserUpdatedListener";

const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.use("/api/followings", followingRouter);

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
        ? "mongodb://host.docker.internal:27017/connectixFollowings"
        : "mongodb://mongo-cluster-ip:27017/followings";

    await mongoose.connect(uriConnection, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Following Database connected successfully!");

    await natsWrapper.connect({
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      connectionUrl: process.env.NATS_URL,
    });

    new UserCreatedListener(natsWrapper.stan).listen();
    new UserUpdatedListener(natsWrapper.stan).listen();

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
