const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Load environment variables from server/.env
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

// Middleware: Enable CORS for frontend requests
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (like curl, postman) or matching local origins
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Explicitly handle OPTIONS preflight across all routes
app.options('*', cors());

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Base health route to verify API status in browser or tools
app.get('/', (req, res) => {
  res.json({ message: 'Appointment Scheduler API is running smoothly.' });
});

// Mount appointment routes at /api/appointments
app.use('/api/appointments', appointmentRoutes);

// Catch-all 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/appointments`);
});
