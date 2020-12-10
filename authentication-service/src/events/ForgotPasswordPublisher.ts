import { ForgotPasswordEvent, Publisher, Subjects } from "@marius98/common";

export class ForgotPasswordPublisher extends Publisher<ForgotPasswordEvent> {
  subject: ForgotPasswordEvent["subject"] = Subjects.ForgotPasswordEvent;
}
