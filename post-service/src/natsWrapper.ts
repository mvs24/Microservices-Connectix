import nats, { Stan } from "node-nats-streaming";

interface ConnectionOptions {
  clusterId: string;
  clientId: string;
  connectionUrl: string;
}

class NatsWrapper {
  protected _stan?: Stan;

  get stan(): Stan {
    if (!this._stan) throw new Error("Stan is not connected yet!");

    return this._stan;
  }

  connect(connectionOptions: ConnectionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this._stan = nats.connect(
        connectionOptions.clusterId,
        connectionOptions.clientId,
        {
          url: connectionOptions.connectionUrl,
        }
      );

      this._stan.on("connect", () => {
        console.log("Post Nats connected!");
        resolve();
      });

      this.stan.on("error", (err) => {
        return reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
