import mongoose from "mongoose";
import { Status } from "@marius98/common";

interface FollowingAttrs {
  follower: string;
  followingUser: string;
  status: Status;
  _id: string;
  version: number;
}

interface FollowingDocument extends mongoose.Document {
  follower: string;
  followingUser: string;
  status: Status;
  version: number;
}

interface FollowingModel extends mongoose.Model<FollowingDocument> {
  build(attrs: FollowingAttrs): FollowingDocument;
  findByEvent(_id: string, version: number): Promise<FollowingDocument>;
}

const followingSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: [Status.Pending, Status.Accepted, Status.Rejected],
    default: Status.Pending,
  },
});

followingSchema.set("versionKey", "version");

followingSchema.statics.build = function (attrs: FollowingAttrs) {
  return new Following(attrs);
};

followingSchema.statics.findByEvent = async function (
  _id: string,
  version: number
) {
  return await Following.findOne({
    _id,
    version: version - 1,
  });
};

const Following = mongoose.model<FollowingDocument, FollowingModel>(
  "Following",
  followingSchema
);

export { Status };
export default Following;
