import { CommentDeletedEvent, Publisher, Subjects } from "@marius98/common";

export class CommentDeletedPublisher extends Publisher<CommentDeletedEvent> {
  subject: CommentDeletedEvent["subject"] = Subjects.CommentDeletedEvent;
}
