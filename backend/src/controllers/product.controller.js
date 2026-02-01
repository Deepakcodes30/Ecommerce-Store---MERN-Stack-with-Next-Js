import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    mrp,
    discountedPrice,
    stock,
    sku,
    variants = [],
    tags = [],
    category,
  } = req.body;

  if (!title || !slug || !description || !mrp || !sku) {
    throw new apiError(400, "Required fields are missing");
  }

  const existingProduct = await Product.findOne({
    $or: [{ sku }, { slug }],
  });

  if (existingProduct) {
    throw new apiError(400, "Product already exists");
  }

  if (!req.files?.images?.length) {
    throw new apiError(400, "Product images are required");
  }

  const uploadedImages = [];

  for (const file of req.files.images) {
    const result = await uploadOnCloudinary(file.path);
    uploadedImages.push({
      url: result.url,
      public_id: result.public_id,
    });
  }

  if (!uploadedImages?.length) {
    throw new apiError(500, "Image upload failed");
  }

  const product = await Product.create({
    title,
    slug,
    description,
    mrp,
    discountedPrice,
    stock,
    sku,
    category,
    variants,
    tags,
    images: uploadedImages,
  });

  return res
    .status(201)
    .json(new apiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  if (req.files?.images?.length) {
    // delete old images
    for (const img of product.images) {
      await deleteFromCloudinary(img);
    }

    const uploadedImages = await uploadOnCloudinary(req.files.images);
    product.images = uploadedImages.map((img) => img.url);
  }

  await product.save();

  return res
    .status(200)
    .json(new apiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  for (const img of product.images) {
    await deleteFromCloudinary(img);
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Product deleted successfully"));
});

const updateProductStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { stock } = req.body;

  if (stock < 0) {
    throw new apiError(400, "Stock cannot be negative");
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { stock },
    { new: true }
  );

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  return res.status(200).json(new apiResponse(200, product, "Stock updated"));
});

const toggleProductStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  product.isActive = !product.isActive;
  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, product, "Product status updated"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { category, color, minPrice, maxPrice, sort } = req.query;

  // const isAdmin = req.user?.isAdmin === true;

  // const filter = isAdmin ? {} : { isActive: true };

  const filter = {};

  // category filter
  if (category) {
    filter.category = { $in: category.split(",") };
  }

  // price range filter
  if (minPrice || maxPrice) {
    filter.discountedPrice = {};
    if (minPrice) filter.discountedPrice.$gte = Number(minPrice);
    if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice);
  }

  // color filter (inside variants)
  if (color) {
    filter["variants.color"] = { $in: color.split(",") };
  }

  let sortQuery = { createdAt: -1 }; // default newest

  if (sort === "price_asc") sortQuery = { discountedPrice: 1 };
  if (sort === "price_desc") sortQuery = { discountedPrice: -1 };
  if (sort === "name_asc") sortQuery = { title: 1 };
  if (sort === "name_desc") sortQuery = { title: -1 };

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort(sortQuery);

  return res
    .status(200)
    .json(new apiResponse(200, products, "Products fetched successfully"));
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true });
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  return res.status(200).json(new apiResponse(200, product, "Product fetched"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;

  if (!categorySlug) {
    throw new apiError(400, "Category slug missing");
  }

  const category = await Category.findOne({ slug: categorySlug });
  if (!category) {
    throw new apiError(400, "Category not found");
  }

  const products = await Product.find({
    category: category._id,
    isActive: true,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, products, "Products fetched successfully"));
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
};
