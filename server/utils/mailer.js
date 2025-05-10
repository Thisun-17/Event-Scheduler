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
  const email = event.email;
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
        <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
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

// Setup a scheduler to check for reminders
const scheduleReminders = async () => {
  try {
    // In a real application, you would use a proper scheduling library like node-cron
    setInterval(async () => {
      // Get events happening in the next 24 hours that haven't had reminders sent
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const events = await Event.find({
        date: { $gte: new Date(), $lte: tomorrow },
        'reminder.send': true,
        'reminder.sent': false
      });
      
      for (const event of events) {
        if (event.reminder.email) {
          const sent = await sendReminderEmail(event.reminder.email, event);
          
          if (sent) {
            // Update the event to mark reminder as sent
            event.reminder.sent = true;
            await event.save();
          }
        }
      }
    }, 1000 * 60 * 60); // Check every hour
  } catch (error) {
    console.error('Error scheduling reminders: ', error);
  }
};

module.exports = { sendReminderEmail, scheduleReminders };

// .env (create this file in the server root directory)
MONGO_URI=mongodb://localhost:27017/event-scheduler
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create a new event
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
