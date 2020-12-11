import { PostCreatedEvent, Publisher, Subjects } from "@marius98/common";

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  subject: PostCreatedEvent["subject"] = Subjects.PostCreatedEvent;
}
