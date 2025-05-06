const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const { errorMonitor } = require("nodemailer/lib/xoauth2");

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

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHander(error.message, 500));
    }
  });

  // Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details
exports.getUserDetails = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
});

//Updating User Password
exports.updateUserPassword = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHander("old password is incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHander("Password does not matched", 400))
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 201, res); 
});

// Update User Profile
exports.updateUserProfile = catchAsyncError(async(req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    });

    res.status(201).json({
        message: "User Profile Updated Successfully",
        user,
    });
});

// Get all users -- Admin
exports.getAllUsers = catchAsyncError(async(req, res, next) => {

    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    })
});

// Get Single User -- Admin
exports.getSingleUser = catchAsyncError(async(req, res, next) => {

  const user = await User.findById(req.params.id);
  if(!user) {
    return next(new ErrorHander(`User does not exists with this ID: ${req.params.id}`, 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role -- Admin
exports.updateRole = catchAsyncError(async(req,res,next) => {

    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      success: true,
      user,
      message: "Role updated successfully"
    });
});

// Delete User -- Admin
exports.deleteUser = catchAsyncError(async(req,res,next) => {

  const user = await User.findById(req.params.id);

  if(!user) {
    return next(ErrorHander(`User does not exists with ID: ${req.params.id}`, 400));
  }

  await user.deleteOne();
    
  res.status(200).json({
    success: true,
    message: "User Deleted successfully"
  });
});