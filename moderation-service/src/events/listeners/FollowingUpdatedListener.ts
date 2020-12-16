import { FollowingUpdatedEvent, Listener, Subjects } from "@marius98/common";
import { Message } from "node-nats-streaming";
import Following from "../../models/followingModel";
import { queueGroup } from "../queueGroup";

export class FollowingUpdatedListener extends Listener<FollowingUpdatedEvent> {
  subject: FollowingUpdatedEvent["subject"] = Subjects.FollowingUpdatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: FollowingUpdatedEvent["data"], msg: Message) {
    try {
      console.log(data);
      // const following = await Following.findByEvent(data._id, data.version);
      // console.log(following);

      // following.status = data.status;
      // following.version = data.version;

      // await following.save();

      msg.ack();
    } catch (err) {
      console.log(err);
    }
  }
}
