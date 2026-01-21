import express from "express";
import Order from "../models/order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/orders/my-orders
//@desc Get logged-in user's order
//@access Private

router.get("/my-orders", protect, async (req, res) => {
  try {
    // Find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //sort by the most recent orders

    return res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET /api/orders/:id
//@desc Get order details by ID
//@access Private

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Return the full order details

    return res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
