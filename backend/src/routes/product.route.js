import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get("/get-all-products", getAllProducts);
router.get("/category/:categorySlug", getProductsByCategory);
router.get("/:slug", getProductBySlug);

// Admin
router.post(
  "/create-product",
  verifyJWT,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 20 }]),
  createProduct
);

router.put(
  "/:productId/update-product",
  verifyJWT,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 20 }]),
  updateProduct
);

router.delete("/:productId/delete-product", verifyJWT, isAdmin, deleteProduct);
router.patch(
  "/:productId/update-product-stock",
  verifyJWT,
  isAdmin,
  updateProductStock
);
router.patch(
  "/:productId/toggle-product-status",
  verifyJWT,
  isAdmin,
  toggleProductStatus
);

export default router;
