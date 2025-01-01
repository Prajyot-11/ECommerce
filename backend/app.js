const express = require("express");
const app = express();

// Use express.json() to parse incoming JSON requests
app.use(express.json()); // Corrected line

// Route Import
const product = require("./routes/productRoute");

// Define your routes
app.use("/api/v1", product);

module.exports = app;
