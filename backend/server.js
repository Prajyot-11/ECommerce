const app = require("./app");
const dotenv = require("dotenv");

const connectDatabase = require("./config/database")

// Hnadling Uncaught Exception like console.log(youtube)  handling such exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to uncaught exception`);
    server.close(() => {
        process.exit(1);
    });
});


// CONFIG - Load environment variables from the .env file
dotenv.config({ path: "backend/config/config.env" });


// Connecting to the database

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});


// Unhandle promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    
    server.close(() => {
        process.exit(1);
    });
});
