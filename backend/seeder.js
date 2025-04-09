const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");
const connectDB = require("./config/db");

dotenv.config();

// Function to connect to MongoDB
connectDB();

// Function to seed the data
const seedData = async () => {
  try {
    await connectDB(); // Ensure DB is connected

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create an admin user

    const createdUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "123456", // Store hashed password
      role: "admin",
    });

    const userID = createdUser._id;

    // Assign admin user to products
    const sampleProducts = products.map((product) => ({
      ...product,
      user: userID, // Correct key for user assignment
    }));

    await Product.insertMany(sampleProducts);
    console.log("✅ Product Data Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding the Data:", error);
    process.exit(1);
  }
};

seedData(); // ✅ Corrected function call
