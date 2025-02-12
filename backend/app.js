const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");

// Use express.json() to parse incoming JSON requests
app.use(express.json()); // Corrected line

// Route Import
const product = require("./routes/productRoute");

// Define your routes
app.use("/api/v1", product);

//Middleware for error
app.use(errorMiddleware); 

module.exports = app;
