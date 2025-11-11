const nodemailer = require("nodemailer");
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
const smtpPortRaw = process.env.SMTP_PORT || process.env.EMAIL_PORT;
const smtpPort = smtpPortRaw ? Number(smtpPortRaw) : undefined;
const smtpService = process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE;
const smtpUser = process.env.SMTP_MAIL || process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.APP_PASSWORD;

const transporterConfig = smtpService
  ? {
      service: smtpService,
      auth: { user: smtpUser, pass: smtpPass },
    }
  : {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // common convention
      auth: { user: smtpUser, pass: smtpPass },
    };


const transporter = nodemailer.createTransport(transporterConfig);

function baseEmailTemplate({ title, bodyHtml, ctaLabel, ctaUrl }) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${title}</title>
      <style>
        body { background-color: #f6f9fc; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
        .container { width: 100%; max-width: 560px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 28px; }
        h1 { font-size: 20px; margin: 0 0 12px; color: #111827; }
        p { color: #374151; line-height: 1.6; }
        .btn { display: inline-block; margin-top: 16px; background: #3b82f6; color: white; text-decoration: none; padding: 10px 16px; border-radius: 8px; }
        .muted { color: #6b7280; font-size: 12px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>${title}</h1>
          <div>${bodyHtml}</div>
          ${ctaUrl ? `<a class="btn" href="${ctaUrl}" target="_blank" rel="noopener noreferrer">${ctaLabel || 'Open'}</a>` : ''}
          <p class="muted">If you didn\'t request this, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
  </html>`;
}

exports.templates = { baseEmailTemplate };


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
      from: smtpUser,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await transporter.sendMail(mailOption);
  } catch (err) {
    throw new Error("Otp sending failed");
  }
};
