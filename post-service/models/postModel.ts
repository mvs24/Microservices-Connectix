import mongoose from "mongoose";

interface PostAttrs {}

interface PostDocument extends mongoose.Document {}

interface PostModel extends mongoose.Model<PostDocument> {
  build(attrs: PostAttrs): PostDocument;
}

const postSchema = new mongoose.Schema({});

const Post = mongoose.model("Post", postSchema);

export default Post;
