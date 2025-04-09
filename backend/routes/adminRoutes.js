const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already exists" });
    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    res.status(201).json({ message: "user Created Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error " });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(400).json({ message: "No user Found" });
    user.name = name || user.name;
    user.email = email || user.email;
    // user.password = password;
    user.role = role || user.role;
    const updatedUser = await user.save();
    res
      .status(201)
      .json({ message: "user Updated  Successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error " });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(400).json({ message: "No user Found" });
    const deletedUser = await user.deleteOne();
    res
      .status(201)
      .json({ message: "user deleted  Successfully", deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error " });
  }
});

module.exports = router;
