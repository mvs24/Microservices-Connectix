import mongoose from "mongoose";

export enum Status {
  Pending = "Pending",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

interface FollowingAttrs {
  follower: string;
  followingUser: string;
  status: Status;
  followingAt: Date;
}

interface FollowingDocument extends mongoose.Document {
  follower: string;
  followingUser: string;
  status: Status;
  version: number;
  followingAt: Date;
}

interface FollowingModel extends mongoose.Model<FollowingDocument> {
  build(attrs: FollowingAttrs): FollowingDocument;
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
    enum: Object.values(Status),
    default: Status.Pending,
  },
  followingAt: Date,
});

followingSchema.statics.build = function (attrs: FollowingAttrs) {
  return new Following(attrs);
};

const Following = mongoose.model<FollowingDocument, FollowingModel>(
  "Following",
  followingSchema
);

export default Following;
