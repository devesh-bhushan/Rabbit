const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/products
// @desc  Create a new product
// @access Private (Admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
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
      dimensions,
      weight,
      sku,
    } = req.body;

    // Basic validation
    if (!name || !price || !category || !sku) {
      return res
        .status(400)
        .json({ message: "Name, price, category, and SKU are required" });
    }

    if (discountPrice && discountPrice >= price) {
      return res.status(400).json({
        message: "Discount price must be lower than the original price",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
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
      dimensions,
      weight,
      sku,
      user: req.user._id, // References the Admin user creating the product
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

//@route get /API/products/new-arrivals
//@desc retrive latest 8 products-creation date
//Access public

router.get("/new-arrivals", async (req, res) => {
  try {
    // Fetch latest 8 products, sorted by creation date (newest first)
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 }) // Newest first
      .limit(8); // Limit to the latest 8 products

    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api.products/best-seller
//@desc Retrive the Product with highest rating
//access public

router.get("/best-seller", async (req, res) => {
  try {
    // Fetch top-rated products, sorted by rating (descending)
    const bestSellers = await Product.findOne().sort({ rating: -1 }); // Highest-rated first

    if (!bestSellers) {
      res.status(404).json({ message: "No Best Seller Found" });
    }
    res.json(bestSellers);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route  PUT /api/products/:id
// @desc   Update a product
// @access Private (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
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
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields only if provided
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.sizes = sizes ?? product.sizes;
    product.colors = colors ?? product.colors;
    product.collections = collections ?? product.collections;
    product.material = material ?? product.material;
    product.gender = gender ?? product.gender;
    product.images = images ?? product.images;
    product.tags = tags ?? product.tags;
    product.dimensions = dimensions ?? product.dimensions;
    product.weight = weight ?? product.weight;
    product.sku = sku ?? product.sku;

    // Handle boolean values correctly
    if (typeof isFeatured !== "undefined") product.isFeatured = isFeatured;
    if (typeof isPublished !== "undefined") product.isPublished = isPublished;

    // Save updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//@route Delete api/product/:id
// @desc Delete a product by id
//@access by Admin only

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne(); // OR await product.remove() for older Mongoose versions

    res
      .status(200)
      .json({ message: `Product '${product.name}' removed successfully` });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public

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

    let query = {};

    // Filtering based on collection
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    // Filtering based on category
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    // Filtering by size (multiple sizes allowed)
    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    // Filtering by color (allowing multiple colors)
    if (color) {
      query.colors = { $in: [color] };
    }

    // Filtering by gender
    if (gender) {
      query.gender = gender;
    }

    // Filtering by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filtering by material (multiple materials allowed)
    if (material) {
      query.material = { $in: material.split(",") };
    }

    // Filtering by brand (multiple brands allowed)
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    // Search functionality (case insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      if (sortBy === "priceAsc") sort = { price: 1 };
      else if (sortBy === "priceDesc") sort = { price: -1 };
      else if (sortBy === "popularity") sort = { rating: -1 };
    }

    // Fetch products with applied filters, sorting, and pagination
    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    // Count total products for pagination info

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    // Handle invalid ObjectId errors (e.g., if the ID is not valid MongoDB ObjectId)
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /application/products/similar/:id
// @desc    Retrieve similar products based on the current product's gender and category
// @access  Public

router.get("/similar/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const { gender, category, _id } = product;

    // Log query for debugging
    console.log("Fetching similar products for:", { gender, category });

    // Fetch similar products
    const similarProducts = await Product.find({
      _id: { $ne: _id }, // Exclude current product
      gender: gender || { $exists: true }, // Allow products with any gender
      category: category || { $exists: true }, // Allow products with any category
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
