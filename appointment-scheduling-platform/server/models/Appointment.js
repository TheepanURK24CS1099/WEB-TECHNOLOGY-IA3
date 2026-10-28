const mongoose = require('mongoose');

// Schema definition for Appointment records
const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  date: {
    type: String,
    required: [true, 'Appointment date is required'],
    // Format: YYYY-MM-DD
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    // Format: HH:mm (24-hour format)
    match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:mm (24-hour) format']
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    minlength: [3, 'Reason must be at least 3 characters'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    default: 'Booked',
    enum: ['Booked', 'Cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate bookings for the same date and time slot
// This guarantees database-level protection against concurrent booking race conditions
appointmentSchema.index({ date: 1, time: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
