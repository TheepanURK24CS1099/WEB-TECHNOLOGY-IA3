import React, { useState } from 'react';
import '../styles/AppointmentForm.css';

/**
 * Returns today's date formatted as YYYY-MM-DD for the HTML date input min attribute.
 */
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a selected date and time are in the past.
 */
const isSelectedTimeInPast = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const selectedDate = new Date(year, month - 1, day, hours, minutes, 0);
  return selectedDate.getTime() < Date.now();
};

/**
 * AppointmentForm component provides a validated form to book new appointments.
 */
function AppointmentForm({ onBookAppointment, isSubmitting }) {
  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    reason: ''
  });

  // Field validation error messages
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form inputs on client-side
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const todayStr = getTodayDateString();

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.date) {
      newErrors.date = 'Appointment date is required.';
    } else if (formData.date < todayStr) {
      newErrors.date = 'Appointment date cannot be in the past.';
    }

    if (!formData.time) {
      newErrors.time = 'Appointment time is required.';
    } else if (formData.date && isSelectedTimeInPast(formData.date, formData.time)) {
      newErrors.time = 'Appointment time cannot be in the past.';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for appointment is required.';
    } else if (formData.reason.trim().length < 3) {
      newErrors.reason = 'Reason must be at least 3 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onBookAppointment(formData);
    if (success) {
      // Reset form fields on successful booking
      setFormData({
        name: '',
        email: '',
        date: '',
        time: '',
        reason: ''
      });
      setErrors({});
    }
  };

  return (
    <section className="form-card" aria-label="Book an appointment">
      <div className="form-header">
        <h2 className="form-title">Book an Appointment</h2>
        <p className="form-subtitle">Fill in the form below to reserve your appointment.</p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={errors.name ? 'form-input input-error' : 'form-input'}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required-star">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={errors.email ? 'form-input input-error' : 'form-input'}
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        {/* Date and Time Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              min={getTodayDateString()}
              className={errors.date ? 'form-input input-error' : 'form-input'}
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="time" className="form-label">
              Time <span className="required-star">*</span>
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className={errors.time ? 'form-input input-error' : 'form-input'}
              value={formData.time}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.time && <span className="field-error">{errors.time}</span>}
          </div>
        </div>

        {/* Reason for Appointment */}
        <div className="form-group">
          <label htmlFor="reason" className="form-label">
            Reason for Appointment <span className="required-star">*</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            className={errors.reason ? 'form-textarea input-error' : 'form-textarea'}
            placeholder="Briefly describe the purpose of your appointment..."
            value={formData.reason}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.reason && <span className="field-error">{errors.reason}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </section>
  );
}

export default AppointmentForm;
