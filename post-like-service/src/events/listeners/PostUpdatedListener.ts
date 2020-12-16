import {
  AppError,
  Listener,
  PostUpdatedEvent,
  Subjects,
} from "@marius98/common";
import { Message } from "node-nats-streaming";
import Post from "../../models/postModel";
import { queueGroup } from "../queueGroup";

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
  subject: PostUpdatedEvent["subject"] = Subjects.PostUpdatedEvent;
  queueGroup = queueGroup;

  async eventHandler(data: PostUpdatedEvent["data"], msg: Message) {
    try {
      const post = await Post.findByEvent(data.id, data.version);

      if (!post) {
        throw new AppError("Post not found!", 404);
      }

      post.content = data.content;
      post.postType = data.postType;
      post.version = data.version;

      await post.save();

      msg.ack();
    } catch (err) {
      console.log(err);
    }
  }
}
