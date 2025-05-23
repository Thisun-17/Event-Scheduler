const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send reminder email
const sendReminderEmail = async (event) => {
  const email = event.reminder.email;
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${event.name}`,
      html: `
        <h2>Event Reminder</h2>
        <p>This is a reminder for the upcoming event:</p>
        <h3>${event.name}</h3>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
        <p>We look forward to seeing you there!</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

// In a production app, you would implement a more sophisticated scheduling system
const scheduleReminders = async () => {
  try {
    console.log('Reminder scheduling feature initialized');
    // This is a placeholder for future implementation
  } catch (error) {
    console.error('Error scheduling reminders: ', error);
  }
};

module.exports = { sendReminderEmail, scheduleReminders };
