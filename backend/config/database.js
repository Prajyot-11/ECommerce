const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI)
    .then((data) => {
        console.log(`Connection is successful with ${data.connection.host}`);
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
}

module.exports = connectDatabase;

/*
mongoose.connect("mongo://localhost:27017/Ecommerce",{useNewUrlParser:true,useUnifiedTopology:true,UseCreatedIndex:true}).then((data)=>{
    console.log(`connection is successful with ${data.connection.host}`);
}).catch((err)=>{
    console.log(err);
});
*/

