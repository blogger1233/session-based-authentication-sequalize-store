const express = require("express")
const app = express();
const registration =require("./routes/registration")
app.use("/registration",registration)

app.listen(8000,function(){
    console.log("http://localhost:8000")
})