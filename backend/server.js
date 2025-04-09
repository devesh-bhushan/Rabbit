const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3000;

// connect to MOngodb
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the rabbit app");
});

// API Routes
if (userRoutes) {
  app.use("/api/users", userRoutes);
} else {
  console.error("Error: userRoutes is not defined");
}

if (productRoutes) {
  app.use("/api/products", productRoutes);
} else {
  console.error("Error: productRoutes is not defined");
}

if (cartRoutes) {
  app.use("/api/cart", cartRoutes);
} else {
  console.error("Error: productRoutes is not defined");
}

if (checkoutRoutes) {
  app.use("/api/checkout", checkoutRoutes);
} else {
  console.error("Error: productRoutes is not defined");
}
if (orderRoutes) {
  app.use("/api/orders", orderRoutes);
} else {
  console.error("Error: orderRoutes is not defined"); // ✅ Corrected message
}
if (uploadRoutes) {
  app.use("/api/upload", uploadRoutes);
} else {
  console.error("Error: uploadRoutes is not defined"); // ✅ Corrected message
}
if (subscriberRoutes) {
  app.use("/api", subscriberRoutes);
} else {
  console.error("Error: subscriberRoutes is not defined"); // ✅ Corrected message
}
if (adminRoutes) {
  app.use("/api/admin/users", adminRoutes);
} else {
  console.error("Error: adminRoutes is not defined"); // ✅ Corrected message
}
if (productAdminRoutes) {
  app.use("/api/admin/products", productAdminRoutes);
} else {
  console.error("Error: productAdminRoutes is not defined"); // ✅ Corrected message
}
if (adminOrderRoutes) {
  app.use("/api/admin/orders", adminOrderRoutes);
} else {
  console.error("Error: productAdminRoutes is not defined"); // ✅ Corrected message
}

app.listen(PORT, () => {
  console.log(`Server is Running on the port ${PORT}`);
});
