const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.sendMail = async (options) => {
    try {
        console.log("mail reached")

        const mailOption = {
            from: process.env.SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Send email
        await transporter.sendMail(mailOption);
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Error sending email:", err.message);
        throw new Error("Email sending failed");
    }
};

exports.sendOTPEmail = async (options) => {
    console.log("otp reached");

    try {
        const mailOption = {
            from: process.env.SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Changed from sendOTPEmail to sendMail
        await transporter.sendMail(mailOption);
        console.log("Otp sent successfully");

    } catch (err) {
        console.error("Error sending email:", err.message);
        throw new Error("Otp sending failed");
    }
}