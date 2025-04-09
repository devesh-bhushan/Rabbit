const express = require("express");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Function to get the cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  else if (guestId) return await Cart.findOne({ guestId });
  return null;
};

// @route   POST /api/cart
// @desc    Add a product to the cart for guest or logged-in user
// @access  Public
router.post("/", async (req, res) => {
  const { productId, size, color, quantity, guestId, userId } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);

    if (cart) {
      // Check if product with the same size and color already exists
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // Fix: Ensure quantity is treated as a number
        cart.products[productIndex].quantity += Number(quantity);
      } else {
        // Add new product to cart
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url || "",
          price: product.price,
          size,
          color,
          quantity: Number(quantity), // Ensure quantity is a number
        });
      }
    } else {
      // Create a new cart if none exists
      cart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0]?.url || "",
            price: product.price,
            size,
            color,
            quantity: Number(quantity), // Ensure quantity is a number
          },
        ],
      });
    }

    // Update total price
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save cart
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/cart
// @desc    Update product quantity in the cart for guest or logged-in user
// @access  Public
router.put("/", async (req, res) => {
  const { productId, size, color, quantity, guestId, userId } = req.body;

  try {
    // Validate request
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    // Find the cart
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = Number(quantity);
      } else {
        cart.products.splice(productIndex, 1);
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Save the updated cart
      await cart.save();

      res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@ route Delete /api/cart
//@desc Remove a product from a cart
//@access public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the cart
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (p) =>
        !(
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
        )
    );

    // Reset the cart but do not delete it
    if (cart.products.length === 0) {
      cart.totalPrice = 0;
      await cart.save();
      return res.status(200).json({ message: "Cart is now empty", cart });
    }

    // Recalculate total price
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/cart
//@desc get logged in user or guest user cart
//@access public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query; // Accept userId or guestId as query parameters

  try {
    if (!userId && !guestId) {
      return res
        .status(400)
        .json({ message: "User ID or Guest ID is required" });
    }

    // Find the cart for either logged-in user or guest
    let cart = await Cart.findOne({
      $or: [{ user: userId }, { guestId: guestId }],
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route api/cart/merge
//@desc merge guest cart into user cart on login
//@access private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user._id; // Extract logged-in user ID from `protect` middleware

  try {
    if (!guestId) {
      return res.status(400).json({ message: "Guest ID is required" });
    }

    // Fetch both carts
    const userCart = await Cart.findOne({ user: userId });
    const guestCart = await Cart.findOne({ guestId: guestId });

    if (!guestCart) {
      return res.status(404).json({ message: "Guest cart not found" });
    }

    if (!userCart) {
      // If user has no existing cart, assign guest cart to user and remove guest ID
      guestCart.user = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json(guestCart);
    }

    // Merge products from guest cart into user cart
    guestCart.products.forEach((guestProduct) => {
      const existingProductIndex = userCart.products.findIndex(
        (p) =>
          p.productId.toString() === guestProduct.productId.toString() &&
          p.size === guestProduct.size &&
          p.color === guestProduct.color
      );

      if (existingProductIndex > -1) {
        // If product exists in user cart, update quantity
        userCart.products[existingProductIndex].quantity +=
          guestProduct.quantity;
      } else {
        // If product is new, add it to user cart
        userCart.products.push(guestProduct);
      }
    });

    // Recalculate total price
    userCart.totalPrice = userCart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save updated user cart and delete guest cart
    await userCart.save();
    await Cart.deleteOne({ guestId: guestId });

    res.status(200).json(userCart);
  } catch (error) {
    console.error("Error merging carts:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
