import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CommentAttrs {
  user: string;
  post: string;
  content: string;
}

interface CommentDocument extends mongoose.Document {
  user: string;
  post: string;
  content: string;
  version: number;
}

interface CommentModel extends mongoose.Model<CommentDocument> {
  build(attrs: CommentAttrs): CommentDocument;
}

const commentSchema = new mongoose.Schema({
  user: String,
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  content: String,
});

commentSchema.set("versionKey", "version");
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = function (attrs: CommentAttrs) {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDocument, CommentModel>(
  "Comment",
  commentSchema
);

export default Comment;
