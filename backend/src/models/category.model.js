import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
categorySchema.index({ isActive: 1 });

categorySchema.pre("validate", function () {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
});

export const Category = mongoose.model("Category", categorySchema);
