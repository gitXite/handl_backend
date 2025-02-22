const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../config/db');

// Email service functions
//
// Confirmation email
async function sendConfirmationEmail(userEmail, userId) {
    const token = crypto.randomBytes(32).toString('hex');

    await pool.query('UPDATE users SET email_token = $1 WHERE id = $2', [token, userId]);

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Confirm your Email',
        text: `Welcome to HANDL!\n\nClick the link to confirm your email: https://handl.dev/auth/confirm-email?token=${token}\nIf you encounter any problems, please let us know at support@handl.dev\n\nRegards, Daniel\nHANDL`,
    };

    await transporter.sendMail(mailOptions);
}


module.exports = {
    sendConfirmationEmail,
}
