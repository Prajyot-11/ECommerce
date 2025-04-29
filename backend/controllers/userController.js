const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const {name, email, password} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is sample id of avatar",
            url: "profile pic URL"
        }
    })

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
    })
});

// Login User
exports.loginUser = catchAsyncError(async(req,res,next) => {

    const {email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorHander("Please enter email and password", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user) {
        return next(new ErrorHander("Please enter valid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
    })
});

