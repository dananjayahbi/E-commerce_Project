const Product = require("../models/Product.model");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Global Variables
let productF_image_url = "";
let productFImg_local_path = "";
let productGalleryImagesLocalPaths = [];
let productGalleryImagesUrls = [];

// Upload image to the temp_image folder
// Define storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/temp_images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = "productFeatureImage" + ext;
    cb(null, fileName);
  },
});

// Set up multer with the defined storage
const uploadSingle = multer({ storage: storage }).single("profileFimage");

const uploadFeaturedProductImage = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file", err);
      return res
        .status(500)
        .json({ success: false, error: "File upload failed" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const filePath = path.join(
      __dirname,
      "../images/temp_images",
      req.file.filename
    );
    productFImg_local_path = filePath;

    return res.status(200).json({ success: true });
  });
};

// Upload multiple images to the temp_image folder
// Define storage for image upload
const multiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/temp_images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = "PI" + Date.now() + ext;
    cb(null, fileName);
  },
});

// Set up multer with the defined storage for multiple files
const uploadMultiple = multer({ storage: multiStorage }).array(
  "productImages",
  10
);

const uploadMultipleProductImages = (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files", err);
      return res
        .status(500)
        .json({ success: false, error: "Files upload failed" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No files uploaded" });
    }

    const filePaths = req.files.map((file) =>
      path.join(__dirname, "../images/temp_images", file.filename)
    );

    // Save the local paths in the productGalleryImagesLocalPaths global variable
    productGalleryImagesLocalPaths = filePaths;

    // Assuming you want to store all file paths in an array, you can use it as needed
    console.log("File paths:", productGalleryImagesLocalPaths);

    return res.status(200).json({ success: true });
  });
};

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

    // Upload product product images to Cloudinary
    const uploadProductGalleryImages = async () => {
      // Upload product feature image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        productFImg_local_path,
        { folder: "Products" }
      );
      productF_image_url = cloudinaryResponse.url;
      console.log(productF_image_url);

      //Upload gallery images to Cloudinary
      try {
        for (const imagePath of productGalleryImagesLocalPaths) {
          const imageName = path.basename(imagePath);

          // Check if the image is a gallery image
          if (imageName.startsWith("PI")) {
            const cloudinaryResponse = await cloudinary.uploader.upload(
              imagePath,
              { folder: "Products" }
            );
            const imageUrl = cloudinaryResponse.url;

            // Store the uploaded image URL
            productGalleryImagesUrls.push(imageUrl);

            console.log("Uploaded image:", imageUrl);
          }
        }
      } catch (error) {
        console.error("Error uploading product gallery images:", error);
      }
    };

    await uploadProductGalleryImages();

    // Delete the local files after successful Cloudinary upload
    fs.unlinkSync(productFImg_local_path);
    for (const imagePath of productGalleryImagesLocalPaths) {
      fs.unlinkSync(imagePath);
    }
    productFImg_local_path = "";
    productGalleryImagesLocalPaths = [];

    const newProduct = new Product({
      productName,
      category,
      featureImage: productF_image_url,
      productGallery: productGalleryImagesUrls,
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
  uploadFeaturedProductImage,
  uploadMultipleProductImages,
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
