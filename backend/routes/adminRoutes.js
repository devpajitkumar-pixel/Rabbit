import express from "express";
import User from "../models/user.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/users
//@desc Get all users(Admin only)
//@access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route POST /api/admin/users
//@desc Add a new user(Admin only)
//@access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    return res
      .status(201)
      .json({ message: "User Created successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route PUT /api/admin/users/:id
//@desc Add a new user(Admin only)
//@access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields only
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/admin/users/:id
//@desc Delete a user(Admin only)
//@access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    return res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
