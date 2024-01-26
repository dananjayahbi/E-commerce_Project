const Brand = require("../models/Brand.model");
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
let brand_image_url = "";
let brandImg_local_path = "";

// Upload image to the temp_image folder
// Define storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/temp_images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = "brandImage" + ext;
    cb(null, fileName);
  },
});

// Set up multer with the defined storage
const upload = multer({ storage: storage }).single("brandLogo");

const uploadImage = (req, res) => {
  upload(req, res, async (err) => {
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
    brandImg_local_path = filePath;

    console.log(brandImg_local_path);

    return res.status(200).json({ success: true });
  });
};

//Add Brand
const addBrand = async (req, res) => {
  const { brandName, description } = req.body;
  try {
    if (brandName == "" || description == "") {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const beandExists = await Brand.findOne({ brandName: brandName });
    if (beandExists) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      brandImg_local_path,
      { folder: "Brands" }
    );
    brand_image_url = cloudinaryResponse.url;
    console.log(brand_image_url);

    // Delete the local file after successful Cloudinary upload
    fs.unlinkSync(brandImg_local_path);
    brandImg_local_path = "";

    const newBrand = new Brand({
      brandName,
      description,
      imageURL: brand_image_url,
    });

    await newBrand.save();
    res.json({ message: "Brand added successfully" });
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get all brands
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get brand by id
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      res.status(404).json({
        errorMessage: "Brand not found",
      });
    } else {
      res.json(brand);
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update brand
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    const { brandName, description } = req.body;

    let oldBrandImageUrl = brand.imageURL; // default to existing image
    let publicId = ""; // variable to store the public_id

    // Upload update image to Cloudinary
    if (brandImg_local_path != "") {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        brandImg_local_path,
        { folder: "Brands" }
      );
      brand_image_url = cloudinaryResponse.url;
      console.log(brand_image_url);

      // Delete the local file after successful Cloudinary upload
      fs.unlinkSync(brandImg_local_path);
      brandImg_local_path = "";

      //Extract the public id of the cloudinary image URL
      const urlSegments = oldBrandImageUrl.split("/");
      const publicIdIndex = urlSegments.indexOf("Brands");
      const publicIdWithExtension = urlSegments.slice(publicIdIndex).join("/");
      publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

      // Delete the existing image from Cloudinary
      const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
        publicId
      );
      console.log(cloudinaryDeleteResponse);
    }

    let updateData = {
      brandName: brandName ? brandName : brand.brandName,
      description: description ? description : brand.description,
      imageURL: brand_image_url ? brand_image_url : brand.imageURL,
    };

    const update = await Brand.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "Brand Updated Successfully!",
        status: true,
      });
    } else {
      res.status(400).json({
        data: "Brand Update Failed!",
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

//Delete brand
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        data: "Brand Not Found!",
        status: false,
      });
    } else {
      const remove = await Brand.findByIdAndDelete(req.params.id);

      if (remove) {
        res.status(200).json({
          data: "Brand Deleted Successfully!",
          status: true,
        });
      } else {
        res.status(400).json({
          data: "Brand Delete Failed!",
          status: false,
        });
        return;
      }

      let oldBrandImageUrl = brand.imageURL;
      let publicId = "";

      //Extract the public id of the cloudinary image URL
      const urlSegments = oldBrandImageUrl.split("/");
      const publicIdIndex = urlSegments.indexOf("Brands");
      const publicIdWithExtension = urlSegments.slice(publicIdIndex).join("/");
      publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

      // Delete the existing image from Cloudinary
      const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
        publicId
      );
      console.log(cloudinaryDeleteResponse);
      
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

module.exports = {
  uploadImage,
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
