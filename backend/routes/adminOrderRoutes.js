import express from "express";
import Order from "../models/order.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/orders
//@desc Get all products(Admin only)
//@access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    return res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route PUT /api/admin/orders/:id
//@desc Update order status(Admin only)
//@access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    order.isDelivered =
      req.body.status === "Delivered" ? true : order.isDelivered;
    order.deliveredAt =
      req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/admin/orders/:id
//@desc Remove an order (Admin only)
//@access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    await order.deleteOne();

    return res.json({
      message: "order removed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
