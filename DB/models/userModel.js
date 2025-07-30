import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      public_id: String,
      secure_url: String,
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default:"user",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("products", {
  ref: "product",
  foreignField: "createdBy",
  localField: "_id",
});

export const userModel = mongoose.model("user", userSchema);
