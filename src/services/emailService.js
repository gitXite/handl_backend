const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../config/db');

// Email service functions
//
// Confirmation email
async function sendConfirmationEmail(userEmail, userId) {
    const token = crypto.randomBytes(32).toString('hex');

    await pool.query('UPDATE users SET email_token = $1 WHERE id = $2', [token, userId]);

    //
}
