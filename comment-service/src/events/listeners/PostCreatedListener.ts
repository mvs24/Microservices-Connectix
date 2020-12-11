import { Listener, PostCreatedEvent, Subjects } from "@marius98/common";
import { Message } from "node-nats-streaming";
import Post from "../../models/postModel";
import { queueGroup } from "../queueGroup";

export class PostCreatedListener extends Listener<PostCreatedEvent> {
  subject: PostCreatedEvent["subject"] = Subjects.PostCreatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: PostCreatedEvent["data"], msg: Message) {
    const post = Post.build({
      content: data.content,
      createdAt: data.createdAt,
      postType: data.postType,
      version: data.version,
      user: data.user,
    });
    await post.save();
  }
}
