const nodemailer = require('nodemailer');
const ApiError = require('../utils/ApiError');

// Email service functions
//
// Confirmation email
const sendConfirmationEmail = async (userEmail, token) => {
    const baseURL = process.env.BASE_URL;
    try {
        let transporter;
        if (process.env.NODE_ENV === 'production') {
            transporter = nodemailer.createTransport({
                host: 'mail.spacemail.com',
                port: 465,
                secure: true,
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
            html: `
                <h1>Welcome to HANDL!</h1>
                <p>Click the link to confirm your email:</p>
                <a href="${process.env.NODE_ENV === 'development' ? `${baseURL}/confirm-email?token=` : 'https://handl.dev/confirm-email?token='}${token}">Confirm your email</a>
                <p>If you encounter any problems, please let us know!</p>
                <p>Kind regards,<br>Daniel<br>HANDL</p>
            `,
        };
    
        const info = await transporter.sendMail(mailOptions);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Test email preview URL:', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw new ApiError(500, 'Failed to send confirmation email');
    }
};

// Send emails from contact page
const sendContactEmail = async (userName, userEmail, userSubject, userText) => {
    try {
        const transporter = nodemailer.createTransport({
        host: 'mail.spacemail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"HANDL" ${process.env.EMAIL_USER}`,
        to: process.env.EMAIL_CONTACT,
        subject: `${userName} - ${userEmail} - ${userSubject}`,
        text: userText,
    };

    await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw new ApiError(500, 'Failed to send contact email');
    }
};

// Send email to reset password
const sendPasswordToken = async (passwordToken, email) => {
    // Logic here
};


module.exports = {
    sendConfirmationEmail,
    sendContactEmail,
}
