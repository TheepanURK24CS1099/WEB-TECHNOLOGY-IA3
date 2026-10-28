import React from 'react';
import AppointmentCard from './AppointmentCard';
import '../styles/AppointmentList.css';

/**
 * AppointmentList component displays existing appointments or states (loading, empty).
 */
function AppointmentList({ appointments, isLoading, onCancelAppointment }) {
  return (
    <section className="list-container" aria-label="Booked Appointments">
      <div className="list-header">
        <h2 className="list-title">
          Scheduled Appointments
          <span className="count-badge">
            {isLoading ? '...' : appointments.length}
          </span>
        </h2>
      </div>

      {isLoading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading appointments from database...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon" aria-hidden="true">📋</div>
          <h3 className="empty-state-title">No Appointments Yet</h3>
          <p className="empty-state-text">
            There are currently no appointments scheduled. Fill out the booking form to reserve your time slot!
          </p>
        </div>
      ) : (
        <div className="cards-wrapper">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={onCancelAppointment}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default AppointmentList;
