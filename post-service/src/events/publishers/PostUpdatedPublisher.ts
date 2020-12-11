import { PostUpdatedEvent, Publisher, Subjects } from "@marius98/common";

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
  subject: PostUpdatedEvent["subject"] = Subjects.PostUpdatedEvent;
}
