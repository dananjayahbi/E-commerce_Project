const Product = require("../models/Product.model");

//Add Product
const addProduct = async (req, res) => {
  const {
    productName,
    category,
    featureImage,
    productGallery,
    productCode,
    brand,
    unit,
    sellingPrice,
    barcodeNumber,
    stocks,
    notes,
  } = req.body;
  try {
    if (
      productName == "" ||
      category == "" ||
      featureImage == "" ||
      productGallery == [] ||
      productCode == "" ||
      brand == "" ||
      unit == "" ||
      sellingPrice == "" ||
      barcodeNumber == "" ||
      stocks == "" ||
      notes == ""
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const productExists = await Product.findOne({ productName: productName });
    if (productExists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const newProduct = new Product({
      productName,
      category,
      featureImage,
      productGallery,
      productCode,
      brand,
      unit,
      sellingPrice,
      barcodeNumber,
      stocks,
      notes,
    });

    await newProduct.save();
    res.json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        errorMessage: "Product not found",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const {
      productName,
      category,
      featureImage,
      productGallery,
      productCode,
      brand,
      unit,
      sellingPrice,
      barcodeNumber,
      stocks,
      notes,
    } = req.body;

    let updateData = {
      productName: productName ? productName : product.productName,
      category: category ? category : product.category,
      featureImage: featureImage ? featureImage : product.featureImage,
      productGallery: productGallery ? productGallery : product.productGallery,
      productCode: productCode ? productCode : product.productCode,
      brand: brand ? brand : product.brand,
      unit: unit ? unit : product.unit,
      sellingPrice: sellingPrice ? sellingPrice : product.sellingPrice,
      barcodeNumber: barcodeNumber ? barcodeNumber : product.barcodeNumber,
      stocks: stocks ? stocks : product.stocks,
      notes: notes ? notes : product.notes,
    };

    const update = await Product.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "Product Updated Successfully!",
        status: true,
      });
    } else {
      res.status(400).json({
        data: "Product Update Failed!",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        data: "Product Not Found!",
        status: false,
      });
    } else {
      const remove = await Product.findByIdAndDelete(req.params.id);

      if (remove) {
        res.status(200).json({
          data: "Product Deleted Successfully!",
          status: true,
        });
      } else {
        res.status(400).json({
          data: "Product Delete Failed!",
          status: false,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
