import { Listener, PostDeletedEvent, Subjects } from "@marius98/common";
import { Message } from "node-nats-streaming";
import Post from "../../models/postModel";
import { queueGroup } from "../queueGroup";

export class PostDeletedListener extends Listener<PostDeletedEvent> {
  subject: PostDeletedEvent["subject"] = Subjects.PostDeletedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: PostDeletedEvent["data"], msg: Message) {
    await Post.findByIdAndDelete(data.id);
  }
}
