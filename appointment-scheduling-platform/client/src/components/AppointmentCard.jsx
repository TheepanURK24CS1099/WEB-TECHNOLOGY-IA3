import React, { useState } from 'react';
import '../styles/AppointmentCard.css';

/**
 * Formats a 24-hour time string (HH:mm) into a 12-hour AM/PM string.
 * Example: '14:30' -> '2:30 PM'
 */
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minuteStr} ${ampm}`;
};

/**
 * Formats a YYYY-MM-DD date string into a user-friendly format.
 * Example: '2026-10-28' -> 'Wed, Oct 28, 2026'
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * AppointmentCard displays the details of a single booked appointment.
 */
function AppointmentCard({ appointment, onCancel }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelClick = async () => {
    const appointmentId = appointment._id || appointment.id;
    if (!appointmentId) return;

    setIsCancelling(true);
    try {
      await onCancel(appointmentId);
    } catch (error) {
      setIsCancelling(false);
    }
  };

  return (
    <div className="appointment-card">
      <div className="card-top-row">
        <div className="card-person-info">
          <h3 className="client-name">{appointment.name}</h3>
          <span className="client-email">{appointment.email}</span>
        </div>
        <span className="status-badge">{appointment.status || 'Booked'}</span>
      </div>

      <div className="card-schedule-info">
        <div className="schedule-item">
          <span className="schedule-icon" aria-hidden="true">📅</span>
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="schedule-item">
          <span className="schedule-icon" aria-hidden="true">⏰</span>
          <span>{formatTime(appointment.time)}</span>
        </div>
      </div>

      <div className="card-reason-info">
        <span className="reason-label">Reason</span>
        <p className="reason-text">{appointment.reason}</p>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancelClick}
          disabled={isCancelling}
          title="Cancel this appointment"
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
        </button>
      </div>
    </div>
  );
}

export default AppointmentCard;
