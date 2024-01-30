const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    let ext = "";
    if (file.mimetype === "image/jpeg") {
      ext = ".jpg";
    } else if (file.mimetype === "image/png") {
      ext = ".png";
    }
    cb(null, "dashboardLogo" + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).single("file");

// Function to handle single image upload
const uploadDashboardLogo = (req, res) => {
  try {
    // Delete the existing file if it exists
    const jpgPath = path.join(__dirname, "../images/dashboardLogo.jpg");
    const pngPath = path.join(__dirname, "../images/dashboardLogo.png");
    if (fs.existsSync(jpgPath)) {
      fs.unlinkSync(jpgPath);
    } else if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
    }

    upload(req, res, (err) => {
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

      const filePath = path.join(__dirname, "../images", req.file.filename);
      return res.status(200).json({ success: true, filePath: filePath });
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return res
      .status(500)
      .json({ success: false, error: "File upload failed" });
  }
};

// Function to get the image named 'dashboardLogo'
const getDashboardLogo = (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "../images");
    const files = fs.readdirSync(directoryPath);
    const dashboardLogoFile = files.find((file) =>
      file.startsWith("dashboardLogo")
    );

    if (!dashboardLogoFile) {
      return res
        .status(404)
        .json({ success: false, error: "Dashboard logo not found" });
    }

    const filePath = path.join(directoryPath, dashboardLogoFile);
    return res.sendFile(filePath);
  } catch (error) {
    console.error("Error getting dashboardLogo image", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get dashboardLogo image" });
  }
};

// A function to give the responce to the system online checker
const checkSystemOnline = (req, res) => {
  return res.status(200).json({ online: true });
};

module.exports = {
  uploadDashboardLogo,
  getDashboardLogo,
  checkSystemOnline,
};
