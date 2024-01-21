const Unit = require("../models/Unit.model");

//Add Unit
const addUnit = async (req, res) => {
  const { unitName, shortName, baseUnit, operator, operationValue } = req.body;
  try {
    if (unitName == "" || shortName == "" || baseUnit == "" || operator == "" || operationValue == "") {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const unitExists = await Unit.findOne({ unitName: unitName });
    if (unitExists) {
      return res.status(400).json({ message: "Unit already exists" });
    }

    const newUnit = new Unit({
      unitName,
      shortName,
      baseUnit,
      operator,
      operationValue,
    });

    await newUnit.save();
    res.json({ message: "Unit added successfully" });
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get all units
const getUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get unit by id
const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      res.status(404).json({
        errorMessage: "Unit not found",
      });
    } else {
      res.json(unit);
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update unit
const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    const { unitName, shortName, baseUnit, operator, operationValue } = req.body;

    let updateData = {
      unitName: unitName ? unitName : unit.unitName,
      shortName: shortName ? shortName : unit.shortName,
      baseUnit: baseUnit ? baseUnit : unit.baseUnit,
      operator: operator ? operator : unit.operator,
      operationValue: operationValue ? operationValue : unit.operationValue,
    };

    const update = await Unit.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "Unit Updated Successfully!",
        status: true,
      });
    } else {
      res.status(400).json({
        data: "Unit Update Failed!",
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

//Delete unit
const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        data: "Unit Not Found!",
        status: false,
      });
    } else {
      const remove = await Unit.findByIdAndDelete(req.params.id);

      if (remove) {
        res.status(200).json({
          data: "Unit Deleted Successfully!",
          status: true,
        });
      } else {
        res.status(400).json({
          data: "Unit Delete Failed!",
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
  addUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
