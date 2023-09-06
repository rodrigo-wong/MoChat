const nodemailer = require("nodemailer");
require("dotenv").config()
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user:process.env.MOCHAT_EMAIL,
        pass:process.env.MOCHAT_EMAIL_PASSWORD
    }
});

module.exports = transporter;