import { Publisher, Subjects, UserCreatedEvent } from "@marius98/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: UserCreatedEvent["subject"] = Subjects.UserCreatedEvent;
}
