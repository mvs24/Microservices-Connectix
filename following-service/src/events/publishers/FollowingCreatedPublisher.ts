import { FollowingCreatedEvent, Publisher, Subjects } from "@marius98/common";

export class FollowingCreatedPublisher extends Publisher<FollowingCreatedEvent> {
  subject: FollowingCreatedEvent["subject"] = Subjects.FollowingCreatedEvent;
}
