const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

// Use express.json() to parse incoming JSON requests
app.use(express.json()); // Corrected line
app.use(cookieParser());

// Route Import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

// Define your routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//Middleware for error
app.use(errorMiddleware); 

module.exports = app;