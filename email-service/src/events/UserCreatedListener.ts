import { Listener, Subjects, UserCreatedEvent } from "@marius98/common";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queueGroup";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: UserCreatedEvent["subject"] = Subjects.UserCreatedEvent;
  queueGroup = queueGroup;

  eventHandler(data: UserCreatedEvent["data"], msg: Message) {
    console.log(data);
    msg.ack();
  }
}
