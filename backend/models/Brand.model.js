const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  brandName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  }
});

const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;
