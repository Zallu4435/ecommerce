const { google } = require('googleapis');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

/**
 * Send email using Gmail API with OAuth2 authentication
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.from - Optional sender email (defaults to GMAIL_USER_EMAIL)
 * @returns {Promise<Object>} Gmail API response
 */
async function sendGmail({ to, subject, html, from }) {
    try {
        // Validate required environment variables
        if (!process.env.GMAIL_CLIENT_ID) {
            throw new Error('GMAIL_CLIENT_ID is not configured');
        }
        if (!process.env.GMAIL_CLIENT_SECRET) {
            throw new Error('GMAIL_CLIENT_SECRET is not configured');
        }
        if (!process.env.GMAIL_REFRESH_TOKEN) {
            throw new Error('GMAIL_REFRESH_TOKEN is not configured');
        }
        if (!process.env.GMAIL_USER_EMAIL) {
            throw new Error('GMAIL_USER_EMAIL is not configured');
        }

        // Validate required parameters
        if (!to) {
            throw new Error('Recipient email (to) is required');
        }
        if (!subject) {
            throw new Error('Email subject is required');
        }
        if (!html) {
            throw new Error('Email HTML content is required');
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        // Set credentials with refresh token
        oauth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        });

        // Initialize Gmail API v1
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Build MIME message
        const senderEmail = from || process.env.GMAIL_USER_EMAIL;
        const messageParts = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset="UTF-8"',
            `To: ${to}`,
            `From: ${senderEmail}`,
            `Subject: ${subject}`,
            '',
            html,
        ];

        const message = messageParts.join('\n');

        // Encode message to base64url format
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // Send email via Gmail API
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('Gmail sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending Gmail:', error.message);

        // Provide more specific error messages
        if (error.message.includes('invalid_grant')) {
            throw new Error('Gmail OAuth2 refresh token is invalid or expired. Please regenerate the refresh token.');
        } else if (error.message.includes('invalid_client')) {
            throw new Error('Gmail OAuth2 client credentials are invalid. Please check GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET.');
        } else if (error.code === 403) {
            throw new Error('Gmail API access forbidden. Please ensure Gmail API is enabled in Google Cloud Console.');
        } else if (error.code === 401) {
            throw new Error('Gmail authentication failed. Please verify your OAuth2 credentials.');
        }

        throw new Error(`Gmail sending failed: ${error.message}`);
    }
}

module.exports = { sendGmail };
