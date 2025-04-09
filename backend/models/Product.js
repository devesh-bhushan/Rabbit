const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price; // Ensure discountPrice < price
        },
        message: "Discount price must be lower than the original price",
      },
    },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, required: true, trim: true },
    category: { type: String, required: true },
    brand: { type: String, trim: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    collections: { type: String, required: true },
    material: { type: String, trim: true },
    gender: { type: String, enum: ["Men", "Women", "Unisex"] },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, trim: true },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    tags: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeyword: { type: String, trim: true },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    weight: { type: Number, min: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
