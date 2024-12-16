const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    try {
        console.log("mail reached")
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL, // Fixed typo
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOption = {
            from: process.env.SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Send email
        await transporter.sendMail(mailOption);
        console.log("Email sent successfully"); // Optional for debugging
    } catch (err) {
        console.error("Error sending email:", err.message);
        throw new Error("Email sending failed"); // Throw error to calling function
    }
};

module.exports = sendMail;
