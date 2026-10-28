import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import {
  getAllAppointments,
  createAppointment,
  cancelAppointment
} from './services/appointmentService';
import './styles/App.css';

/**
 * App component coordinates the state, backend communication, and layout.
 */
function App() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch appointments from MongoDB when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Clear success notification after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  /**
   * Load all appointments from backend
   */
  const fetchAppointments = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle booking a new appointment
   */
  const handleBookAppointment = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await createAppointment(formData);
      // Append the new appointment to local state
      if (response.appointment) {
        setAppointments((prev) => [...prev, response.appointment]);
      } else {
        // Re-fetch to ensure list is in sync
        await fetchAppointments();
      }

      setSuccessMessage('Appointment booked successfully! Your slot is confirmed.');
      return true;
    } catch (error) {
      console.error('Error booking appointment:', error.message);
      setErrorMessage(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancelling an appointment
   */
  const handleCancelAppointment = async (id) => {
    setErrorMessage('');
    try {
      await cancelAppointment(id);
      // Remove cancelled appointment from local state immediately
      setAppointments((prev) => prev.filter((item) => item._id !== id && item.id !== id));
      setSuccessMessage('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error.message);
      setErrorMessage(error.message);
      throw error;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="main-content">
        {/* Hero Header */}
        <header className="hero-section">
          <h1 className="hero-title">Schedule Your Appointment</h1>
          <p className="hero-description">
            Easily book a convenient time slot, view your active appointments, or cancel if your plans change.
          </p>
        </header>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="alert-banner alert-success" role="alert">
            <span>✅ {successMessage}</span>
            <button
              type="button"
              className="alert-close-btn"
              onClick={() => setSuccessMessage('')}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="alert-banner alert-error" role="alert">
            <span>⚠️ {errorMessage}</span>
            <button
              type="button"
              className="alert-close-btn"
              onClick={() => setErrorMessage('')}
              aria-label="Dismiss error message"
            >
              ×
            </button>
          </div>
        )}

        {/* Grid Layout: Booking Form (Left) & Appointment List (Right) */}
        <div className="app-grid">
          <AppointmentForm
            onBookAppointment={handleBookAppointment}
            isSubmitting={isSubmitting}
          />

          <AppointmentList
            appointments={appointments}
            isLoading={isLoading}
            onCancelAppointment={handleCancelAppointment}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Appointment Scheduling Platform &copy; {new Date().getFullYear()} &bull; Built with React, Node, Express & MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
