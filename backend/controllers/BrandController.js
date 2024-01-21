const Brand = require("../models/Brand.model");

//Add Brand
const addBrand = async (req, res) => {
  const { brandName, description, imageURL } = req.body;
  try {
    if (brandName == "" || description == "" || imageURL == "") {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const beandExists = await Brand.findOne({ brandName: brandName });
    if (beandExists) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const newBrand = new Brand({
      brandName,
      description,
      imageURL,
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
    const { brandName, description, imageURL } =
      req.body;

    let updateData = {
      brandName: brandName ? brandName : brand.brandName,
      description: description ? description : brand.description,
      imageURL: imageURL ? imageURL : brand.imageURL,
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
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
