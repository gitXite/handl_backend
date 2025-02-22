const nodemailer = require('nodemailer');
const pool = require('../config/db');

// Email service functions
//
// Confirmation email
const sendConfirmationEmail = async (userEmail, token) => {
    let transporter;
    if (process.env.NODE_ENV === 'production') {
        transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    
    const mailOptions = {
        from: process.env.EMAIL_USER || 'test@ethereal.email',
        to: userEmail,
        replyTo: process.env.EMAIL_CONTACT,
        subject: 'Confirm your Email',
        text: `Welcome to HANDL!\n\nClick the link to confirm your email: https://handl.dev/auth/confirm-email?token=${token}\nIf you encounter any problems, please let us know!\n\nRegards, Daniel\nHANDL`,
    };

    const info = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV !== 'production') {
        console.log('Test email preview URL:', nodemailer.getTestMessangerUrl(info));
    }
};

// Send emails from contact page
const sendContactEmail = async (userName, userEmail, userSubject, userText) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_CONTACT,
        replyTo: userEmail,
        subject: `${userName} - ${userSubject}`,
        text: userText,
    };

    await transporter.sendMail(mailOptions);
};


module.exports = {
    sendConfirmationEmail,
    sendContactEmail,
}
