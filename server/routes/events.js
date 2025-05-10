const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { sendReminderEmail } = require('../utils/mailer');

// @route   GET api/events
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
    const newEvent = new Event({
      ...req.body
    });
    
    const event = await newEvent.save();
    
    // Send email notification if needed
    if (event.email) {
      sendReminderEmail(event);
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    await event.deleteOne();
    
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;
