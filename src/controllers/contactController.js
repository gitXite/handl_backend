const emailService = require('../services/emailService');


// Controller functions for contact page
const contactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        res.status(400).json({ message: 'All fields must be filled out' });
    }

    await emailService.sendContactEmail(name, email, subject, message);
    res.status(200).json({ message: 'Contact form submitted' });
};


module.exports = {
    contactEmail,
};
