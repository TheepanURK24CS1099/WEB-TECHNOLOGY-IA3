// Configurable API Base URL pointing to the Express server
// In Vite, environment variables can be prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/appointments';

/**
 * Fetch all booked appointments from the backend API.
 * @returns {Promise<Array>} List of appointment objects
 */
export const getAllAppointments = async () => {
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Check if network failed or server is offline
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please make sure the server is running on port 5000.');
    }
    throw error;
  }
};

/**
 * Submit a new appointment booking to the backend API.
 * @param {Object} appointmentData - { name, email, date, time, reason }
 * @returns {Promise<Object>} Created appointment record and message
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Failed to create appointment (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your backend connection.');
    }
    throw error;
  }
};

/**
 * Cancel and delete an appointment by its MongoDB ID.
 * @param {string} id - Appointment ID
 * @returns {Promise<Object>} Result message and cancelled appointment
 */
export const cancelAppointment = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Failed to cancel appointment (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your backend connection.');
    }
    throw error;
  }
};
