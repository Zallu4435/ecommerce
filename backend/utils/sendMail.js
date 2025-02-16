const nodemailer = require("nodemailer");
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


exports.sendMail = async (options) => {
  try {
    const mailOption = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html, 
    };

    await transporter.sendMail(mailOption);
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Email sending failed");
  }
};

exports.sendOTPEmail = async (options) => {
  try {
    const mailOption = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOption);
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Otp sending failed");
  }
};
