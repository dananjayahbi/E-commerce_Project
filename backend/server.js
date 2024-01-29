const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

//Setting up the server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8060;

app.use(cors());
app.use(express.json());

//Setting up routing
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" }); 
});

app.use("/users", require("./routes/UserRoutes"));
app.use("/roles", require("./routes/RoleRoutes"));
app.use("/systemSettings", require("./routes/SystemSettingsRoutes"));
app.use("/units", require("./routes/UnitRoutes"));
app.use("/brands", require("./routes/BrandRoutes"));
app.use("/categories", require("./routes/CategoryRoutes"));
app.use("/products", require("./routes/ProductRoutes"));

app.listen(PORT, () => {
  console.log("Server up with port : " + PORT);
});


//Setting up the database connection
const URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});