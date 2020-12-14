import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import validator from "validator";

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
  password: string;
  passwordConfirm: string;
  photo?: string;
  profile?: ProfileState;
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
  version: number;
  profile: ProfileState;
  role: Roles;
  createPasswordResetToken(): string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be defined"],
  },
  lastname: {
    type: String,
    required: [true, "Lastname must be defined"],
  },
  photo: String,
  profile: {
    type: String,
    enum: {
      values: [ProfileState.Private, ProfileState.Public],
      message: "Profile must be either public or private",
    },
    default: ProfileState.Public,
  },
  role: {
    type: String,
    enum: [Roles.User, Roles.Admin],
    default: Roles.User,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    select: false,
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    minlength: 6,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

userSchema.methods.correctPassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  return new User(attrs);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //@ts-ignore
  this.password = await bcrypt.hash(this.password, 10);
  //@ts-ignore
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  //@ts-ignore
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
