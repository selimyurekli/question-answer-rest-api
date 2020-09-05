const nodemailer = require("nodemailer");

const sendEmail = async(mailOptions)=>{
const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;

let transporter = nodemailer.createTransport({
        
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: SMTP_USER, // generated ethereal user
          pass: SMTP_PASS, // generated ethereal password
        },
});
let info = await transporter.sendMail(mailOptions);
console.log("Message sent: %s", info.messageId);
}

module.exports = {sendEmail}