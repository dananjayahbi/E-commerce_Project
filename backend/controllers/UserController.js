const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Global Variables
let profile_image_url = "";
let profileImg_local_path = "";

// Upload image to the temp_image folder
// Define storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/temp_images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = "profileImage" + ext;
    cb(null, fileName);
  },
});

// Set up multer with the defined storage
const upload = multer({ storage: storage }).single("profileImage");

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
    profileImg_local_path = filePath;

    return res.status(200).json({ success: true });
  });
};

//Register
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
      NIC,
    } = req.body;

    // Validate input fields
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !role ||
      !phoneNumber ||
      !NIC
    ) {
      return res.status(400).json({ message: "Please enter all the fields" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ message: "Please enter a valid phone number" });
    }

    if (email.indexOf("@") === -1) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Check for existing user
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ message: "A user with the same email already exists" });
    }

    const existingUserByNIC = await User.findOne({ NIC: NIC });
    if (existingUserByNIC) {
      return res
        .status(408)
        .json({ message: "A user with the same NIC already exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res
        .status(406)
        .json({ message: "A user with the same username already exists" });
    }

    const isActive = true;
    const registeredDate = Date.now();
    const lastLogin = Date.now();
    const fullName = firstName + " " + lastName;

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      profileImg_local_path,
      { folder: "profile_images" }
    );
    profile_image_url = cloudinaryResponse.url;
    console.log(profile_image_url);

    // Delete the local file after successful Cloudinary upload
    fs.unlinkSync(profileImg_local_path);
    profileImg_local_path = "";

    // Save the user with Cloudinary image URL
    const newUser = new User({
      fullName,
      username,
      email,
      password: passwordHash,
      role,
      phoneNumber,
      profileImage: profile_image_url,
      NIC,
      isActive,
      registeredDate,
      lastLogin,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
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

    if (user.isActive === false) {
      return res.status(400).json({ message: "User is not active" });
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

    const updateData = {
      lastLogin: Date.now(),
    };

    const updateLoginDate = await User.findByIdAndUpdate(user._id, updateData);

    if (!updateLoginDate) {
      res.status(401).json({
        data: "Login Date Update Failed!",
        status: false,
      });
    }

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

// Update user
const updateUser = async (req, res) => {
  try {
    const { fullName, username, email, role, phoneNumber, NIC, isActive } =
      req.body;

    const userFetch = await User.findById(req.params.id);

    // Handle image upload similar to registration
    let newProfileImageUrl = userFetch.profileImage; // default to existing image
    let publicId = ""; // variable to store the public_id

    // Upload update image to Cloudinary
    if (profileImg_local_path != "") {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        profileImg_local_path,
        { folder: "profile_images" }
      );
      profile_image_url = cloudinaryResponse.url;
      console.log(profile_image_url);

      // Delete the local file after successful Cloudinary upload
      fs.unlinkSync(profileImg_local_path);
      profileImg_local_path = "";

      //Extract the public id of the cloudinary image URL
      const urlSegments = newProfileImageUrl.split("/");
      const publicIdIndex = urlSegments.indexOf("profile_images");
      const publicIdWithExtension = urlSegments.slice(publicIdIndex).join("/");
      publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

      // Delete the existing image from Cloudinary
      const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
        publicId
      );
      console.log(cloudinaryDeleteResponse);
      console.log(profile_image_url);
    }

    let updateData = {
      fullName: fullName ? fullName : userFetch.fullName,
      username: username ? username : userFetch.username,
      email: email ? email : userFetch.email,
      role: role ? role : userFetch.role,
      phoneNumber: phoneNumber ? phoneNumber : userFetch.phoneNumber,
      profileImage: profile_image_url
        ? profile_image_url
        : userFetch.profileImage,
      NIC: NIC ? NIC : userFetch.NIC,
      isActive: isActive !== undefined ? isActive : userFetch.isActive,
      updatedAt: Date.now(),
    };

    const update = await User.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      // Console log the public_id extracted from the Cloudinary URL
      console.log("Public ID:", publicId);

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
    const user = await User.findOne({ otp: req.body.otp });

    if (user) {
      if (user.otp === req.body.otp) {
        // OTP is correct, set status to true or perform any other action
        user.status = true;
        await user.save();

        user.otp = "";
        // Reset the OTP to blank after successful verification
        await user.save();

        return res.json({
          message: "OTP verified successfully",
          status: true,
          user: user,
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP", status: false });
      }
    } else {
      return res.status(401).json({ message: "User not found", status: false });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong!\n" + e });
  }
};

//Handle OTP
const emailVerify = async (req, res) => {
  console.log(req.body);
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
      return res.status(401).json({ errorMessage: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//OTP functions end...

//Reset password
const resetPassword = async (req, res) => {
  try {
    const userFetch = await User.findOne({ _id: req.body.userId });
    if (userFetch) {
      if (userFetch._id == req.body.userId) {
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
        return res.status(400).json({ message: "User not found!" });
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
    const userFetch = await User.findById(req.params.id);
    const profile_image = userFetch.profileImage;

    //Extract the public id of the cloudinary image URL
    const urlSegments = profile_image.split("/");
    const publicIdIndex = urlSegments.indexOf("profile_images");
    const publicIdWithExtension = urlSegments.slice(publicIdIndex).join("/");
    publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

    if (profile_image) {
      // Delete the existing image from Cloudinary
      const cloudinaryDeleteResponse = await cloudinary.uploader.destroy(
        publicId
      );
      console.log(cloudinaryDeleteResponse);

      if (cloudinaryDeleteResponse.result === "ok") {
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
      } else {
        res.status(401).json({
          errorMessage: "Failed deleting the User!\n" + error,
          status: false,
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

module.exports = {
  uploadImage,
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
