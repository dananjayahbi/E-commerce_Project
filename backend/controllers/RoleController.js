const Role = require("../models/Role.model");

//Add Role
const addRole = async (req, res) => {
  const { roleName, description, permissions } = req.body;
  try {
    if (!roleName || !description || !permissions) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (roleName.length < 3) {
      return res
        .status(400)
        .json({ message: "Role name must be at least 3 characters long" });
    }

    const roleExists = await Role.findOne({ roleName: roleName });
    if (roleExists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = new Role({
      roleName,
      description,
      permissions,
    });

    await newRole.save();
    res.json({ message: "Role added successfully" });
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500);
    res.json({ message: error });
  }
};

//Get role by id
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      res.status(404).json({
        errorMessage: "Role not found",
      });
    } else {
      res.json(role);
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Get role by roleName
const getRoleByRoleName = async (req, res) => {
  try {
    const role = await Role.findOne({ roleName: req.params.roleName });

    if (!role) {
      res.status(404).json({
        errorMessage: "Role not found",
      });
    } else {
      res.json(role);
    }
  } catch (error) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    const { roleName, description, permissions } = req.body;

    if (roleName?.length < 3) {
      return res
        .status(400)
        .json({ message: "Role name must be at least 3 characters long" });
    }

    let updateData = {
      roleName: roleName ? roleName : role.roleName,
      description: description ? description : role.description,
      permissions: permissions ? permissions : role.permissions,
    };

    const update = await Role.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "Role Updated Successfully!",
        status: true,
      });
    } else {
      res.status(400).json({
        data: "Role Update Failed!",
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

//Delete role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        data: "Role Not Found!",
        status: false,
      });
    } else {
      const remove = await Role.findByIdAndDelete(req.params.id);

      if (remove) {
        res.status(200).json({
          data: "Role Deleted Successfully!",
          status: true,
        });
      } else {
        res.status(400).json({
          data: "Role Delete Failed!",
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
  addRole,
  getRoles,
  getRoleById,
  getRoleByRoleName,
  updateRole,
  deleteRole,
};
