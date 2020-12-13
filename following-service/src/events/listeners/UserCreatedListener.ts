import { Listener, Subjects, UserCreatedEvent } from "@marius98/common";
import { Message } from "node-nats-streaming";
import User from "../../models/userModel";
import { queueGroup } from "../queueGroup";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: UserCreatedEvent["subject"] = Subjects.UserCreatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: UserCreatedEvent["data"], msg: Message) {
    try {
      const user = User.build({
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        version: data.version,
      });

      await user.save();

      msg.ack();
    } catch (err) {}
  }
}
