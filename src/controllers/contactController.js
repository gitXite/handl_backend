const emailService = require('../services/emailService');


// Controller functions for contact page
const contactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields must be filled out' });
    }
    
    try {
        await emailService.sendContactEmail(name, email, subject, message);
        res.status(200).json({ message: 'Contact form submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit. Please try again.' });
    }
};


module.exports = {
    contactEmail,
};
