const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"444dhruv@gmail.com",
        pass:"oqyryhefymlnsifk"
    }
})
module.exports = {transporter}