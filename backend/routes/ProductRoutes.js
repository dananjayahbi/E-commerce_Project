const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

//ADD PRODUCT
router.post("/addProduct", protect, addProduct);

//GET ALL PRODUCTS
router.get("/getProducts", getProducts);

//GET PRODUCT BY ID
router.get("/getProductById/:id", protect, getProductById);

//UPDATE PRODUCT
router.put("/updateProduct/:id", protect, updateProduct);

//DELETE PRODUCT
router.delete("/deleteProduct/:id", protect, deleteProduct);

module.exports = router;
