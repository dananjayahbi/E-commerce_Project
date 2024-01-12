const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const permissionsSchema = new Schema({
    dashboard: {
        type: Boolean,
        default: false,
    },
    page1: {
        type: Boolean,
        default: false,
    },
    page2: {
        type: Boolean,
        default: false,
    },
    page3: {
        type: Boolean,
        default: false,
    }
});

const roleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: [permissionsSchema],
  updatedAt: Date,
});

const Role = mongoose.model("role", roleSchema);

module.exports = Role;
