import { ForgotPasswordEvent, Listener, Subjects } from "@marius98/common";
import { Message } from "node-nats-streaming";
import { Email } from "../Email";
import { queueGroup } from "./queueGroup";

export class ForgotPasswordListener extends Listener<ForgotPasswordEvent> {
  subject: ForgotPasswordEvent["subject"] = Subjects.ForgotPasswordEvent;
  queueGroup = queueGroup;

  async eventHandler(data: ForgotPasswordEvent["data"], msg: Message) {
    await new Email({
      to: data.email,
      text: `Your password reset token is ${data.resetToken}. (Valid for only 10 minutes)`,
      subject: "Password reset token",
    }).sendEmail();

    msg.ack();
  }
}
