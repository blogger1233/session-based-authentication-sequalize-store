const express = require("express");
const app = express();
const cors = require("cors");

// Use CORS with the specified options
app.use(cors());

// Import and use the registration routes
const registration = require("./routes/registration");
app.use("/registration", registration);


// Import and use the authentication routes
const authentication = require("./routes/auth");
app.use("/auth",authentication)

// Start the server
app.listen(8000, function() {
    console.log("Server running at http://localhost:8000")
})