const { sendGmail } = require('./gmail');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

/**
 * Base email template for consistent styling
 */
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
          <p class="muted">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
  </html>`;
}

/**
 * Send email using Gmail API
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message (optional)
 * @param {string} options.html - HTML content (optional)
 */
exports.sendMail = async (options) => {
  try {
    if (!options.email) {
      throw new Error('Recipient email is required');
    }
    if (!options.subject) {
      throw new Error('Email subject is required');
    }

    // Use HTML if provided, otherwise create simple HTML from plain text
    let htmlContent = options.html;
    if (!htmlContent && options.message) {
      htmlContent = `<p>${options.message.replace(/\n/g, '<br>')}</p>`;
    }

    if (!htmlContent) {
      throw new Error('Either html or message must be provided');
    }

    const response = await sendGmail({
      to: options.email,
      subject: options.subject,
      html: htmlContent,
    });

    console.log('Email sent successfully via Gmail API');
    return response;
  } catch (err) {
    console.error('Error sending email:', err.message);
    throw new Error('Email sending failed');
  }
};

/**
 * Send OTP email using Gmail API
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message (optional)
 * @param {string} options.html - HTML content (optional)
 */
exports.sendOTPEmail = async (options) => {
  try {
    if (!options.email) {
      throw new Error('Recipient email is required');
    }
    if (!options.subject) {
      throw new Error('Email subject is required');
    }

    // Use HTML if provided, otherwise create simple HTML from plain text
    let htmlContent = options.html;
    if (!htmlContent && options.message) {
      htmlContent = `<p>${options.message.replace(/\n/g, '<br>')}</p>`;
    }

    if (!htmlContent) {
      throw new Error('Either html or message must be provided');
    }

    const response = await sendGmail({
      to: options.email,
      subject: options.subject,
      html: htmlContent,
    });

    console.log('OTP email sent successfully via Gmail API');
    return response;
  } catch (err) {
    console.error('Error sending OTP email:', err.message);
    throw new Error('OTP sending failed');
  }
};

// Export the template for backward compatibility
exports.templates = { baseEmailTemplate };
