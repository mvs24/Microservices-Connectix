import mongoose from "mongoose";

interface UserAttrs {
  name: string;
  lastname: string;
  email: string;
  photo?: string;
  version: number;
  _id: string;
}

export interface UserDocument extends mongoose.Document {
  name: string;
  lastname: string;
  email: string;
  photo?: string;
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
  email: {
    type: String,
  },
});

userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
