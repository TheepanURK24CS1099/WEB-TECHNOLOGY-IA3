const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

/**
 * Helper to check whether a date (YYYY-MM-DD) and time (HH:mm) are in the past.
 * Returns true if in the past, false if in the future or current.
 */
const isDateTimeInPast = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Month in JavaScript Date is 0-indexed (0 = January)
  const scheduledDate = new Date(year, month - 1, day, hours, minutes, 0);
  const now = new Date();

  return scheduledDate.getTime() < now.getTime();
};

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments sorted chronologically
 */
const getAllAppointments = async (req, res) => {
  try {
    // Sort appointments by date ascending, then time ascending
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve appointments. Please try again later.' });
  }
};

/**
 * @route   POST /api/appointments
 * @desc    Create a new appointment with validation and conflict checking
 */
const createAppointment = async (req, res) => {
  try {
    const { name, email, date, time, reason } = req.body;

    // 1. Check for missing required fields
    if (!name || !email || !date || !time || !reason) {
      return res.status(400).json({ message: 'All fields (name, email, date, time, reason) are required.' });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // 3. Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD.' });
    }

    // 4. Validate time format (HH:mm in 24h format)
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ message: 'Invalid time format. Expected HH:mm (24-hour).' });
    }

    // 5. Ensure appointment is not in the past
    if (isDateTimeInPast(date, time)) {
      return res.status(400).json({
        message: 'Cannot book appointments in the past. Please choose a future date and time.'
      });
    }

    // 6. Check for conflict: Does an appointment already exist at this date and time?
    const conflictingAppointment = await Appointment.findOne({ date, time });
    if (conflictingAppointment) {
      return res.status(409).json({
        message: 'This time slot is already booked. Please choose a different date or time.'
      });
    }

    // 7. Create and save new appointment
    const newAppointment = new Appointment({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      date,
      time,
      reason: reason.trim(),
      status: 'Booked'
    });

    const savedAppointment = await newAppointment.save();
    return res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: savedAppointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error.message);

    // Handle MongoDB unique index conflict (handles race conditions during concurrent requests)
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This time slot was just booked by another user. Please choose a different time.'
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }

    return res.status(500).json({ message: 'Failed to book appointment. Please try again later.' });
  }
};

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Cancel and delete an appointment by ID
 */
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    return res.status(200).json({
      message: 'Appointment cancelled successfully!',
      appointment
    });

  } catch (error) {
    console.error('Error cancelling appointment:', error.message);
    return res.status(500).json({ message: 'Failed to cancel appointment. Please try again later.' });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  cancelAppointment
};
