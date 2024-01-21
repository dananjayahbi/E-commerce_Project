const Category = require("../models/Category.model");

//Add Category
const addCategory = async (req, res) => {
  const { categoryName, description } = req.body;
  try {
    if (categoryName == "" || description == "") {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const categoryExists = await Category.findOne({ categoryName: categoryName });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName,
      description,
    });

    await newCategory.save();
    res.json({ message: "Category added successfully" });
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get all Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get Category by id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        errorMessage: "Category not found",
      });
    } else {
      res.json(category);
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const { categoryName, description } =
      req.body;

    let updateData = {
      categoryName: categoryName ? categoryName : category.categoryName,
      description: description ? description : category.description,
    };

    const update = await Category.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "Category Updated Successfully!",
        status: true,
      });
    } else {
      res.status(400).json({
        data: "Category Update Failed!",
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

//Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        data: "Category Not Found!",
        status: false,
      });
    } else {
      const remove = await Category.findByIdAndDelete(req.params.id);

      if (remove) {
        res.status(200).json({
          data: "Category Deleted Successfully!",
          status: true,
        });
      } else {
        res.status(400).json({
          data: "Category Delete Failed!",
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
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
