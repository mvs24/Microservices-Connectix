import { Listener, PostUpdatedEvent, Subjects } from "@marius98/common";
import { Message } from "node-nats-streaming";
import Post from "../../models/postModel";
import { queueGroup } from "../queueGroup";

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
  subject: PostUpdatedEvent["subject"] = Subjects.PostUpdatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: PostUpdatedEvent["data"], msg: Message) {
    await Post.findByIdAndUpdate(data.id, {
      content: data.content,
      postType: data.postType,
      version: data.version,
    });
  }
}
