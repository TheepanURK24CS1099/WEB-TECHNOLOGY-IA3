const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  createAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');

// Route: GET /api/appointments - Retrieve all appointments
router.get('/', getAllAppointments);

// Route: POST /api/appointments - Book a new appointment
router.post('/', createAppointment);

// Route: DELETE /api/appointments/:id - Cancel an appointment
router.delete('/:id', cancelAppointment);

module.exports = router;
