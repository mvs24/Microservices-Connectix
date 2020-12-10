import { ForgotPasswordListener } from "./events/ForgotPasswordListener";
import { UserCreatedListener } from "./events/UserCreatedListener";
import { natsWrapper } from "./natsWrapper";

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

    new UserCreatedListener(natsWrapper.stan).listen();
    new ForgotPasswordListener(natsWrapper.stan).listen();
  } catch (error) {
    console.error("error", error);
  }
})();
