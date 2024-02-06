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

//Function to generate product code
const generateProductCode = async () => {
  const randomNumber = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, "0");
  const productCode = "P" + randomNumber;
  return productCode;
};

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
const uploadSingle = multer({ storage: storage }).single("productFimage");

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
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const ext = path.extname(file.originalname);
    const fileName = "PI" + randomNumber + ext;
    cb(null, fileName);
  },
});

// Set up multer with the defined storage for multiple files
const uploadMultiple = multer({ storage: multiStorage }).array("gallery", 10);

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
    if (productFImg_local_path != "") {
      fs.unlinkSync(productFImg_local_path);
    }

    if (productGalleryImagesLocalPaths.length > 0) {
      for (const imagePath of productGalleryImagesLocalPaths) {
        if (imagePath && fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          continue;
        }
      }
    }
    productFImg_local_path = "";
    productGalleryImagesLocalPaths = [];
    const productCode = await generateProductCode();

    const newProduct = new Product({
      productName,
      category,
      featureImage: productF_image_url,
      productGallery: productGalleryImagesUrls,
      productCode: productCode,
      brand,
      unit,
      sellingPrice,
      barcodeNumber,
      stocks,
      notes,
    });

    await newProduct.save();
    productF_image_url = "";
    productGalleryImagesUrls = [];
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

//Update the product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const {
      productName,
      category,
      brand,
      unit,
      sellingPrice,
      barcodeNumber,
      stocks,
      notes,
    } = req.body;

    //handle produyct feature image upload
    try {
      if (productFImg_local_path != "") {
        let oldProductFImageURL = product.featureImage; // default to existing image
        let publicId = ""; // variable to store the public_id

        // Upload update image to Cloudinary
        if (productFImg_local_path) {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            productFImg_local_path,
            { folder: "Products" }
          );
          productF_image_url = cloudinaryResponse.url;
          console.log(productF_image_url);

          // Delete the local file after successful Cloudinary upload
          fs.unlinkSync(productFImg_local_path);
          productFImg_local_path = "";

          //Extract the public id of the cloudinary image URL
          const urlSegments = oldProductFImageURL.split("/");
          const publicIdIndex = urlSegments.indexOf("Products");
          const publicIdWithExtension = urlSegments
            .slice(publicIdIndex)
            .join("/");
          publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

          // Delete the existing image from Cloudinary
          const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
            publicId
          );
          console.log(cloudinaryDeleteResponse);
        }
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage:
          "Something went wrong when uploading the product feature image!\n" +
          error,
        status: false,
      });
    }

    //handle product gallery images upload
    try {
      if (productGalleryImagesLocalPaths.length > 0) {
        let oldProductGalleryImagesUrls = product.productGallery;
        let oldPublicIds = [];

        // Extract public IDs from old Cloudinary image URLs
        for (const oldImageUrl of oldProductGalleryImagesUrls) {
          const urlSegments = oldImageUrl.split("/");
          const publicIdIndex = urlSegments.indexOf("Products");
          const publicIdWithExtension = urlSegments
            .slice(publicIdIndex)
            .join("/");
          const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");
          oldPublicIds.push(publicId);
        }

        if (productGalleryImagesLocalPaths) {
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

          // Delete old images from Cloudinary
          for (const publicId of oldPublicIds) {
            const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
              publicId
            );
            console.log(cloudinaryDeleteResponse);
          }

          console.log("Old public IDs:", oldPublicIds);

          // Delete the local files after successful Cloudinary upload
          if (productFImg_local_path != "") {
            fs.unlinkSync(productFImg_local_path);
          }

          if (productGalleryImagesLocalPaths.length > 0) {
            for (const imagePath of productGalleryImagesLocalPaths) {
              if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              } else {
                continue;
              }
            }
          }
        }
        productFImg_local_path = "";
        productGalleryImagesLocalPaths = [];
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage:
          "Something went wrong when uploading the product gallery images!\n" +
          error,
        status: false,
      });
    }

    console.log(productGalleryImagesUrls);

    // Update product data
    const updateData = {
      productName: productName ? productName : product.productName,
      category: category ? category : product.category,
      featureImage: productF_image_url
        ? productF_image_url
        : product.featureImage,
      productGallery:
        productGalleryImagesUrls.length > 0
          ? productGalleryImagesUrls
          : product.productGallery,
      brand: brand ? brand : product.brand,
      unit: unit ? unit : product.unit,
      sellingPrice: sellingPrice ? sellingPrice : product.sellingPrice,
      barcodeNumber: barcodeNumber ? barcodeNumber : product.barcodeNumber,
      stocks: stocks ? stocks : product.stocks,
      notes: notes ? notes : product.notes,
    };

    const update = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    productF_image_url = "";
    productGalleryImagesUrls = [];

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

      // Delete product feature image from Cloudinary
      try {
        let oldProductFImageURL = product.featureImage;
        let publicId = ""; // variable to store the public_id

        //Extract the public id of the cloudinary image URL
        const urlSegments = oldProductFImageURL.split("/");
        const publicIdIndex = urlSegments.indexOf("Products");
        const publicIdWithExtension = urlSegments
          .slice(publicIdIndex)
          .join("/");
        publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

        // Delete the existing image from Cloudinary
        const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
          publicId
        );
        console.log(cloudinaryDeleteResponse);
      } catch (error) {
        return res.status(500).json({
          errorMessage:
            "Something went wrong when deleing the feature image!\n" + error,
          status: false,
        });
      }

      // Delete product gallery images from Cloudinary
      try {
        let oldProductGalleryImagesUrls = product.productGallery;
        let oldPublicIds = [];

        // Extract public IDs from old Cloudinary image URLs
        for (const oldImageUrl of oldProductGalleryImagesUrls) {
          const urlSegments = oldImageUrl.split("/");
          const publicIdIndex = urlSegments.indexOf("Products");
          const publicIdWithExtension = urlSegments
            .slice(publicIdIndex)
            .join("/");
          const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");
          oldPublicIds.push(publicId);
        }

        // Delete old images from Cloudinary
        for (const publicId of oldPublicIds) {
          const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
            publicId
          );
          console.log(cloudinaryDeleteResponse);
        }
      } catch (error) {
        return res.status(500).json({
          errorMessage:
            "Something went wrong when deleting the gallery images!\n" + error,
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

// Search for products (product name or(and) category)
const searchProducts = async (req, res) => {
  try {
    let query = {};

    // Check if category is provided in the request body
    if (req.body.category) {
      query.category = req.body.category;
    }

    const searchText = req.body.searchText;

    // Construct regular expression for case-insensitive search
    const searchRegex = new RegExp(searchText, "i");

    // Add productName and optional category to the query
    query.productName = { $regex: searchRegex };

    // Query the database for products matching the searchText in productName field
    const products = await Product.find(query);

    res.json({ success: true, products });
  } catch (error) {
    // Handle errors
    console.error("Error searching products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
  searchProducts,
};
