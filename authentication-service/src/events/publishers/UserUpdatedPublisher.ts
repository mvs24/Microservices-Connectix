import { Publisher, Subjects, UserUpdatedEvent } from "@marius98/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: UserUpdatedEvent["subject"] = Subjects.UserUpdatedEvent;
}
