const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
