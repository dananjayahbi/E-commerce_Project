const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    default: "Uncategorized",
  },
  featureImage: {
    type: String,
    required: true,
    default: "",
  },
  productGallery : {
    type: Array,
    default: [],
  },
  productCode: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: "",
  },
  unit: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: Number, // Change to Number for numeric values
    required: true,
    default: 0,
    min: 0, // Add validation for positive values
  },
  barcodeNumber: {
    type: Number,
    default: 0,
  },
  stocks: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: "",
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
