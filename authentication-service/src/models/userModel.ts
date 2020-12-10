import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface UserAttrs {
  name: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  photo?: string;
}

export interface UserDocument extends mongoose.Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  photo?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
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
  password: {
    type: String,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 6,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

userSchema.methods.correctPassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  return new User(attrs);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //@ts-ignore
  this.password = await bcrypt.hash(this.password, 10);
  //@ts-ignore
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
