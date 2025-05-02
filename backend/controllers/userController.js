const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

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

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    // })

    sendToken(user,200,res);    // instead of above we used this
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

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    // })

    sendToken(user,201,res);  // instead of above we used this
});

// Log Out User
exports.logout = catchAsyncError(async(req,res,next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Log Out",
    })
})
