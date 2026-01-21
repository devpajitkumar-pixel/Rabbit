import express from "express";
import Subscriber from "../models/subscriber.js";

const router = express.Router();

//@route POST /api/subscribe
//@desc Handle newsletter subscription
//@access Public

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the email is already subscribe
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ message: "Email is already subscribed." });
    }

    // Create new subscriber

    subscriber = new Subscriber({ email });
    await subscriber.save();
    return res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
