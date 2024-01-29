const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const permissionsSchema = new Schema({
  products: {
        type: Boolean,
        default: false,
    },
    category: {
        type: Boolean,
        default: false,
    },
    units: {
        type: Boolean,
        default: false,
    },
    brands: {
        type: Boolean,
        default: false,
    },
    orders: {
        type: Boolean,
        default: false,
    },
    sales: {
        type: Boolean,
        default: false,
    },
    newSale: {
        type: Boolean,
        default: false,
    },
    customers: {
        type: Boolean,
        default: false,
    },
    users: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: Boolean,
        default: false,
    },
    salesReport: {
        type: Boolean,
        default: false,
    },
    inventoryReport: {
        type: Boolean,
        default: false,
    },
    productsReport: {
        type: Boolean,
        default: false,
    },
    productQuantityAlerts: {
        type: Boolean,
        default: false,
    },
    systemSettings: {
        type: Boolean,
        default: false,
    },
    storeSettings: {
        type: Boolean,
        default: false,
    },
    emailTemplates: {
        type: Boolean,
        default: false,
    },
    backup: {
        type: Boolean,
        default: false,
    },
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
