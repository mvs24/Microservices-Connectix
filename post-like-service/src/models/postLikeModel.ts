import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PostLikeAttrs {
  user: string;
  post: string;
}

interface PostLikeDocument extends mongoose.Document {
  user: string;
  post: string;
  version: number;
}

interface PostLikeModel extends mongoose.Model<PostLikeDocument> {
  build(attrs: PostLikeAttrs): PostLikeDocument;
}

const postLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "A post like must have a post"],
  },
});

postLikeSchema.set("versionKey", "version");
postLikeSchema.plugin(updateIfCurrentPlugin);

postLikeSchema.statics.build = function (attrs: PostLikeAttrs) {
  return new PostLike(attrs);
};

const PostLike = mongoose.model<PostLikeDocument, PostLikeModel>(
  "PostLike",
  postLikeSchema
);

export default PostLike;
