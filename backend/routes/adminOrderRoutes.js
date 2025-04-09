const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (!order) return res.status(404).json({ message: "No order found" });
    order.status = status || order.status;
    order.isDelivered = status === "Delivered" ? true : false;
    order.deliveredAt = status === "Delivered" ? Date.now() : order.deliveredAt;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "No order found" });

    const deletedOrder = await order.deleteOne();
    res.status(200).json({ message: "Order Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
