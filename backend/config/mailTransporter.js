const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user:process.env.MOCHAT_EMAIL,
        pass:process.env.MOCHAT_EMAIL_PASSWORD
    }
});

module.exports = transporter;