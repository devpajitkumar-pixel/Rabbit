import express from "express";
import Product from "../models/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/products
//@desc Get all products(Admin only)
//@access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
