import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  assistantName?: string;
  assistantImage?: string;
  history: string[];

  createdAt: Date;
  updatedAt: Date;

  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;

  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    assistantName: {
      type: String,
      trim: true,
    },

    assistantImage: {
      type: String,
    },

    history: {
      type: [String],
      default: [],
    },

    verifyToken: {
      type: String,
    },

    verifyTokenExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;