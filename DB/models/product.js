import mongoose from "mongoose";
import slugify from "slugify";

export const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock must be positive"],
    },
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const productModel = mongoose.model("product", productSchema);
