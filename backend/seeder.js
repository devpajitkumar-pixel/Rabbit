import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "./models/product.js";
import User from "./models/user.js";
import Cart from "./models/cart.js";
import products from "./data/products.js";

dotenv.config();

//connect to mongoDB

mongoose.connect(process.env.MONGO_URI);

//Function to seed data

const seedData = async () => {
  try {
    //Clear existing data
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create default Admin User

    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    //Assign the default user Id to each product

    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });
    // Insert the products into the database
    await Product.insertMany(sampleProducts);
    console.log("Product data seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data", error);
    process.exit(1);
  }
};

seedData();
