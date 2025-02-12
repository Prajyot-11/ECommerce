const ErrorHander = require("../utils/errorHandler");

module.exports = (err,req,res,next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error";


    // Wrong Mongo DB error i.e getDetail with wrong id
    if(err.name === "RangeError") {
        const message = `Resource not found. Invalid" ${err.path}`;
        err = new ErrorHander(message,400);
    }

    res.status(err.statuscode).json({
        success:false,
        message:err.message,
    });
};
