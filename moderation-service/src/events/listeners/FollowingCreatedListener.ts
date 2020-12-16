import { FollowingCreatedEvent, Listener, Subjects } from "@marius98/common";
import { Message } from "node-nats-streaming";
import Following from "../../models/followingModel";
import { queueGroup } from "../queueGroup";

export class FollowingCreatedListener extends Listener<FollowingCreatedEvent> {
  subject: FollowingCreatedEvent["subject"] = Subjects.FollowingCreatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: FollowingCreatedEvent["data"], msg: Message) {
    try {
      const following = Following.build({
        follower: data.follower,
        followingUser: data.followingUser,
        status: data.status,
        _id: data._id,
        version: data.version,
      });

      await following.save();

      msg.ack();
    } catch (err) {
      console.log(err);
    }
  }
}
