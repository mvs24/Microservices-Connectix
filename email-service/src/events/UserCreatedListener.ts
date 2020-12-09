import { Listener, Subjects, UserCreatedEvent } from "@marius98/common";
import { Message } from "node-nats-streaming";
import { Email } from "../Email";
import { queueGroup } from "./queueGroup";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: UserCreatedEvent["subject"] = Subjects.UserCreatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: UserCreatedEvent["data"], msg: Message) {
    await new Email({
      to: data.email,
      text:
        "Welcome to Connectix family! You are going to have a great time in here!",
      subject: "Welcome to Connectix!",
    }).sendEmail();
    msg.ack();
  }
}
