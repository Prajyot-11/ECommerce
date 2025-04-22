const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

// Create Product  ---> ADMIN
// Not applied catchAsyncError
exports.createProduct = async (req, res) => {

    try {
        // Create a new product using the data from the request body
        const product = await Product.create(req.body);

        // Respond with the created product and a success message
        res.status(201).json({
            success: true,
            product,
        });
    } catch (err) {
        // Handle errors (e.g., validation errors, database connection issues)
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};


// Get All Products
exports.getAllProducts = catchAsyncError(async(req,res) =>{
    
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const product = await apiFeature.query;

    res.status(201).json({
        success: true,
        product,
    });
});


// Update the Product ---> ADMIN
// Not applied catchAsyncError
exports.updateProduct = async (req, res) => {

    try {
        // Find the product by ID
        let product = await Product.findById(req.params.id);

        // Check if the product exists in the database
        if(!product){
            return next(new ErrorHander("Product Not Found", 404));
        }

        // Remove _id from the request body before updating because Id is immutable we can't change/update it.
        const { _id, ...updateData } = req.body;

        // Update the product
        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true, 
            runValidators: true, 
            useFindAndModify: false,
        });

        // Return the updated product
        return res.status(200).json({
            success: true,
            product,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Product ---> ADMIN
exports.deleteProduct = catchAsyncError(async(req,res) =>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product Not Found", 404));
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
        success:true,
        message:"Product deleted successfully",
    });
});

// Get Product Details
exports.getProductDetails = catchAsyncError(async(req,res,next) =>{

    let product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHander("Product Not Found", 404));
    }

    return res.status(201).json({
        success:true,
        product,
        productCount,
    })
});