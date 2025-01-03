const Product = require("../models/productModel");


// Create Product  ---> ADMIN
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
exports.getAllProducts = async(req,res) =>{

    const product = await Product.find();

    res.status(201).json({
        success: true,
        product,
    });
};


// Update the Product ---> ADMIN
exports.updateProduct = async (req, res) => {

    try {
        // Find the product by ID
        let product = await Product.findById(req.params.id);

        // Check if the product exists in the database
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
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
exports.deleteProduct = async(req,res) =>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found",
        });
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
        success:true,
        message:"Product deleted successfully",
    });
};

// Get Product Details
exports.getProductDetails = async(req,res,next) =>{

    let product = await Product.findById(req.params.id);
    
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found",
        })
    }

    return res.status(201).json({
        success:true,
        data:product,
    })
};