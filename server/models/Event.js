const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { sendReminderEmail } = require('../utils/mailer');

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
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events/:id/rsvp
// @desc    Add RSVP to an event
// @access  Public
router.post('/:id/rsvp', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Add the RSVP
    event.rsvps.unshift({
      name: req.body.name,
      email: req.body.email,
      status: req.body.status
    });
    
    await event.save();
    
    res.json(event.rsvps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/filter/:start/:end
// @desc    Get events within a date range
// @access  Public
router.get('/filter/:start/:end', async (req, res) => {
  try {
    const { start, end } = req.params;
    
    const events = await Event.find({
      date: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).sort({ date: 1 });
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/category/:category
// @desc    Get events by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const events = await Event.find({ 
      category: req.params.category 
    }).sort({ date: 1 });
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;