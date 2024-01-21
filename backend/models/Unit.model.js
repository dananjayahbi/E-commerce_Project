const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const unitSchema = new Schema({
  unitName: {
    type: String,
    required: true,
    unique: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  baseUnit: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  operationValue: {
    type: Number,
    required: true,
  },
});

const Unit = mongoose.model("unit", unitSchema);

module.exports = Unit;
