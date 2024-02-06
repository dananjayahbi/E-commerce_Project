const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  uploadFeaturedProductImage,
  uploadMultipleProductImages,
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
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

//UPLOAD FEATURED PRODUCT IMAGE
router.post("/uploadFeaturedProductImage", uploadFeaturedProductImage);

//UPLOAD MULTIPLE PRODUCT IMAGES
router.post("/uploadMultipleProductImages", uploadMultipleProductImages);

//SEARCH PRODUCTS
router.post("/searchProducts", searchProducts);

module.exports = router;
