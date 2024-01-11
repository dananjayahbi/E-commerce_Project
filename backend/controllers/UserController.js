const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//Register a user
const register = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      phoneNumber,
      profileImage,
      NIC,
    } = req.body;

    //validate
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !role ||
      !phoneNumber ||
      !profileImage ||
      !NIC
    ) {
      return res.status(400).json({ message: "Please enter all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (phoneNumber.length != 10) {
      return res
        .status(400)
        .json({ message: "Please enter a valid phone number" });
    }

    if (email.indexOf("@") == -1) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    //check for existing user
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "A user with the same email already exists" });
    }

    const existingUserByNIC = await User.findOne({ NIC: NIC });
    if (existingUserByNIC) {
      return res
        .status(400)
        .json({ message: "A user with the same NIC already exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ message: "A user with the same username already exists" });
    }

    const isActive = true;
    const registeredDate = Date.now();
    const lastLogin = Date.now();
    const fullName = firstName + " " + lastName;

    //hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //save the user
    const newUser = new User({
      fullName,
      username,
      email,
      password: passwordHash,
      role,
      phoneNumber,
      profileImage,
      NIC,
      isActive,
      registeredDate,
      lastLogin,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login a user
const login = async (req, res) => {
  try {
    let { emailOrUsername, password } = req.body;

    // Validate
    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email/username and password" });
    }

    // Check if the user exists by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email/username" });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate and send the JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get a token
const getNewToken = async (req, res) => {
  try {
    const userId = req.params.id; // Access the "id" from the URL parameter
    if (userId) {
      const userFetch = await User.findById({ _id: userId });
      if (userFetch) {
        // generate token
        const token = jwt.sign({ id: userFetch._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.json(token);
      } else {
        res.status(404).json({
          errorMessage: "User not found",
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Id not found in URL parameter",
      });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Get a user
const getUserById = async (req, res) => {
  try {
    const userFetch = await User.findById(req.params.id);
    if (userFetch) {
      res.json(userFetch);
    } else {
      res.status(404).json({
        errorMessage: "User not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const userFetch = await User.find();
    if (userFetch) {
      res.json(userFetch);
    } else {
      res.status(404).json({
        errorMessage: "Users not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Update a user
const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      role,
      phoneNumber,
      profileImage,
      NIC,
      isActive,
    } = req.body;

    const userFetch = await User.findById(req.params.id);

    let updateData = {
      fullName: fullName ? fullName : userFetch.fullName,
      username: username ? username : userFetch.username,
      email: email ? email : userFetch.email,
      role: role ? role : userFetch.role,
      phoneNumber: phoneNumber ? phoneNumber : userFetch.phoneNumber,
      profileImage: profileImage ? profileImage : userFetch.profileImage,
      NIC: NIC ? NIC : userFetch.NIC,
      isActive: isActive ? isActive : userFetch.isActive,
      updatedAt: Date.now(),
    };

    const update = await User.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: "User updated successfully!",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed updating the User!\n" + error,
        status: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//Password change
const changePassword = async (req, res) => {
  try {
    const userFetch = await User.findById(req.params.id);
    if (userFetch) {
      const isPasswordMatch = await bcrypt.compare(
        req.body.oldPassword,
        userFetch.password
      );

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Old password mismatch!" });
      }

      //hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(req.body.newPassword, salt);

      userFetch.password = passwordHash;
      userFetch.updatedAt = Date.now();

      const updatedUser = await userFetch.save();
      if (updatedUser) {
        res.json(updatedUser);
      }
    } else {
      res.status(404).json({
        errorMessage: "User not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//OTP functions...
// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP to the provided email
const sendOTP = async (email, otp) => {
  // Use nodemailer to send the OTP to the user's email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_AUTH_MAIL,
      pass: process.env.GMAIL_AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_AUTH_MAIL,
    to: email,
    subject: "OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      return res.json({ message: "OTP sent successfully" });
    }
  });
};

// Function to handle OTP verification
const verifyOTP = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (user.otp === req.body.otp) {
        // OTP is correct, set status to true or perform any other action
        user.status = true;
        await user.save();

        user.otp = "";
        // Reset the OTP to blank after successful verification
        await user.save();

        return res.json({ message: "OTP verified successfully", status: true });
      } else {
        return res.status(400).json({ message: "Invalid OTP", status: false });
      }
    } else {
      return res.status(404).json({ message: "User not found", status: false });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong!\n" + e });
  }
};

//Handle OTP
const emailVerify = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const otp = generateOTP();
      user.otp = otp;
      await sendOTP(user.email, otp);

      // Save user with OTP in the database
      const updatedUser = await user.save();

      return res.json({
        message: "OTP sent successfully",
        otp: updatedUser.otp,
      });
    } else {
      return res.status(404).json({ errorMessage: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//OTP functions end...

//Reset password
const resetPassword = async (req, res) => {
  try {
    const userFetch = await User.findOne({ email: req.body.email });
    if (userFetch) {
      if (userFetch.email == req.body.email) {
        //hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.newPassword, salt);

        userFetch.password = passwordHash;
        userFetch.updatedAt = Date.now();

        const updatedUser = await userFetch.save();
        if (updatedUser) {
          return res.json({
            message: "Password reset successfully",
            status: true,
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "The email you entered does not match!" });
      }
    } else {
      res.status(404).json({
        errorMessage: "User not found",
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};

//Delete user
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "User deleted successfully!",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed deleting the User!\n" + error,
        status: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

module.exports = {
  register,
  login,
  getNewToken,
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  resetPassword,
  verifyOTP,
  emailVerify,
  deleteUser,
};
