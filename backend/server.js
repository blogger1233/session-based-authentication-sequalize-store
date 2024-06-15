const express = require("express");
const app = express();
const cors = require("cors");

var whitelist = ["http://localhost:5173", "http://192.168.1.8:5173"];

var corsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

const registration = require("./routes/registration");
app.use("/registration", registration);

app.listen(8000, function() {
    console.log("http://localhost:8000");
});
