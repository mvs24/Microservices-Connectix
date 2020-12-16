import mongoose from "mongoose";

export enum ProfileState {
  Public = "public",
  Private = "private",
}

export enum Roles {
  Admin = "admin",
  User = "user",
}

interface UserAttrs {
  name: string;
  lastname: string;
  email: string;
  photo?: string;
  version: number;
  _id: string;
  profile?: ProfileState;
}

export interface UserDocument extends mongoose.Document {
  name: string;
  lastname: string;
  email: string;
  photo?: string;
  profile: string;
  role: string;
  version: number;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  photo: String,
  profile: {
    type: String,
    enum: {
      values: [ProfileState.Public, ProfileState.Private],
      message: "Profile must be either public or private",
    },
    default: ProfileState.Public,
  },
  role: {
    type: String,
    enum: [Roles.Admin, Roles.User],
    default: Roles.User,
  },
  email: {
    type: String,
  },
});

userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
