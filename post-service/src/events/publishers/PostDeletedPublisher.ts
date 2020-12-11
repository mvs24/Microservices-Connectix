import { PostDeletedEvent, Publisher, Subjects } from "@marius98/common";

export class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
  subject: PostDeletedEvent["subject"] = Subjects.PostDeletedEvent;
}
