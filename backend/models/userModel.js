const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name length can not exceed beyond 30 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter Email"],
        unique: true,
        validator: [validator.isEmail, "Please enter valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password should be more than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },   
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date          
}, 
{
    timestamps: true
});

// before save hash the password 
userSchema.pre("save",async function(next) {
    
    if(!this.isModified("password"))
    {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// JWT token to get login after register
userSchema.methods.getJWTToken = function() {
    return jwt.sign({
        id:this._id,
    },
    process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Comparing the password given by user with DB password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}




module.exports = mongoose.model("User", userSchema);