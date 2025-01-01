const app = require("./app");
const dotenv = require("dotenv");

const connectDatabase = require("./config/database")

// CONFIG - Load environment variables from the .env file
dotenv.config({ path: "backend/config/config.env" });


// Connecting to the database

connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});