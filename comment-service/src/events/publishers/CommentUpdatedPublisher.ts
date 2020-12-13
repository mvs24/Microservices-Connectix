import { CommentUpdatedEvent, Publisher, Subjects } from "@marius98/common";

export class CommentUpdatedPublisher extends Publisher<CommentUpdatedEvent> {
  subject: CommentUpdatedEvent["subject"] = Subjects.CommentUpdatedEvent;
}
