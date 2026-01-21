import express from "express";
import Product from "../models/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route POST /api/products
//@desc Create a new products
//@access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
      user: req.user._id, //Reference to the admin user who created it
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route PUT /api/products/:id
//@desc Update an existing product
//@access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    } = req.body;
    //Find product by id
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update only provided fields
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.price = price ?? product.price;
      product.discountPrice = discountPrice ?? product.discountPrice;
      product.countInStock = countInStock ?? product.countInStock;
      product.sku = sku ?? product.sku;
      product.category = category ?? product.category;
      product.brand = brand ?? product.brand;
      product.sizes = sizes ?? product.sizes;
      product.colors = colors ?? product.colors;
      product.collections = collections ?? product.collections;
      product.material = material ?? product.material;
      product.gender = gender ?? product.gender;
      product.images = images ?? product.images;
      product.isFeatured = isFeatured ?? product.isFeatured;
      product.isPublished = isPublished ?? product.isPublished;
      product.tags = tags ?? product.tags;
      product.metaTitle = metaTitle ?? product.metaTitle;
      product.metaDescription = metaDescription ?? product.metaDescription;
      product.metaKeywords = metaKeywords ?? product.metaKeywords;
      product.dimensions = dimensions ?? product.dimensions;
      product.weight = weight ?? product.weight;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route DELETE /api/products/:id
//@desc Delete a product by ID
//@access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    //Find product by id
    const product = await Product.findById(req.params.id);

    if (product) {
      // Delete the product from database

      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route   GET /api/products
//@desc    Get all products with optional query filters
//@access  Public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    const query = {};

    // Filters
    if (collection && collection.toLocaleLowerCase() !== "all")
      query.collection = collection;
    if (gender) query.gender = gender;
    if (category && category.toLocaleLowerCase() !== "all")
      query.category = category;
    if (material) query.material = { $in: material.split(",") };
    if (brand) query.brand = { $in: brand.split(",") };

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: color.split(",") };
    }

    // Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    //Search (name + description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case "priceAsc":
        sort = { price: 1 };
        break;
      case "priceDesc":
        sort = { price: -1 };
        break;
      case "popularity":
        sort = { rating: -1 };
        break;
      default:
        break;
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route   GET /api/products/best-seller
//@desc    Retrive the product with hightest rating
//@access  Public

router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No Best Seller Found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route   GET /api/products/new-arrivals
//@desc    Retrive the latest 8 products
//@access  Public

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    if (newArrivals) {
      res.json(newArrivals);
    } else {
      res.status(404).json({ message: "No New Arrivals Found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route   GET /api/products/:id
//@desc    Get a single product by its ID
//@access  Public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route   GET /api/products/similar/:id
//@desc    Retrive similar products based on the current product's gender and category
//@access  Public

router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      const similarProducts = await Product.find({
        _id: { $ne: id },
        gender: product.gender,
        category: product.category,
      }).limit(4);
      res.json(similarProducts);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
