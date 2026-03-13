import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://berce-backend.vercel.app"],
    credentials: true,
  })
);

//accepting json directly using express
app.use(express.json({ limit: "16kb" }));

//accepting data from URL where the urlencoder converts and encods URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//accepting files and data
app.use(express.static("public"));

//setting up cookieparser
app.use(cookieParser());

//routes setup
import addressRouter from "./routes/address.route.js";
import cartRouter from "./routes/cart.route.js";
import categoryRouter from "./routes/category.route.js";
import couponRouter from "./routes/coupon.route.js";
import orderRouter from "./routes/order.route.js";
import productRouter from "./routes/product.route.js";
import reviewRouter from "./routes/review.route.js";
import userRouter from "./routes/user.route.js";
import wishlistRouter from "./routes/wishlist.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlists", wishlistRouter);

export { app };
