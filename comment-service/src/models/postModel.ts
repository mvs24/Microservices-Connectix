import mongoose from "mongoose";

interface PostAttrs {
  postType: string;
  content: string;
  user: string;
  version: number;
  createdAt: Date;
  _id: string;
}

interface PostDocument extends mongoose.Document {
  postType: string;
  content: string;
  user: string;
  createdAt: Date;
  version: number;
}

interface PostModel extends mongoose.Model<PostDocument> {
  build(attrs: PostAttrs): PostDocument;
  findByEvent(id: string, version: number): PostDocument;
}

const postSchema = new mongoose.Schema({
  postType: {
    type: String,
    enum: {
      values: ["image", "text"],
      message: "Post type must be either image or text.",
    },
  },
  content: String,
  user: String,
  createdAt: Date,
});

postSchema.set("versionKey", "version");

postSchema.statics.build = function (attrs: PostAttrs) {
  return new Post(attrs);
};

postSchema.statics.findByEvent = async function (id: string, version: number) {
  return await Post.findOne({
    _id: id,
    version: version - 1,
  });
};

const Post = mongoose.model<PostDocument, PostModel>("Post", postSchema);

export default Post;
