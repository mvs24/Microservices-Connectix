import { CommentCreatedEvent, Publisher, Subjects } from "@marius98/common";

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent> {
  subject: CommentCreatedEvent["subject"] = Subjects.CommentCreatedEvent;
}
