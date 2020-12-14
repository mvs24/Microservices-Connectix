import { FollowingUpdatedEvent, Publisher, Subjects } from "@marius98/common";

export class FollowingUpdatedPublisher extends Publisher<FollowingUpdatedEvent> {
  subject: FollowingUpdatedEvent["subject"] = Subjects.FollowingUpdatedEvent;
}
