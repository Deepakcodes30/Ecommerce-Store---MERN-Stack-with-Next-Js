import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    variants: [
      {
        color: String,
        stock: {
          type: Number,
          min: 0,
        },
      },
    ],
    tags: [String],
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//adding performance index so that DB can directly search the required fields
productSchema.index({ category: 1, isActive: 1 });

productSchema.pre("validate", function () {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
});

//making sure Discounted price is not greater than MRP
productSchema.pre("save", function (next) {
  if (this.discountedPrice > this.mrp) {
    return next(new Error("Discounted price cannot exceed MRP"));
  }
  next;
});

export const Product = mongoose.model("Product", productSchema);
