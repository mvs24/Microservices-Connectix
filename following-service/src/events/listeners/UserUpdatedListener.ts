import { Listener, Subjects, UserUpdatedEvent } from "@marius98/common";
import { Message } from "node-nats-streaming";
import User from "../../models/userModel";
import { queueGroup } from "../queueGroup";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: UserUpdatedEvent["subject"] = Subjects.UserUpdatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: UserUpdatedEvent["data"], msg: Message) {
    try {
      await User.findByIdAndUpdate(data.id, {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        version: data.version,
        photo: data.photo,
        profile: data.profile,
      });

      msg.ack();
    } catch (err) {
      console.log(err);
    }
  }
}
