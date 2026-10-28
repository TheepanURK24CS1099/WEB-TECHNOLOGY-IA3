# Appointment Scheduling Platform

A clean, modern, and beginner-friendly full-stack web application designed for booking, viewing, and cancelling appointments. Built specifically with the core MERN stack (React with Vite, Node.js, Express.js, and MongoDB with Mongoose) without complex abstractions or heavy external UI frameworks.

---

## 1. Project Overview

The **Appointment Scheduling Platform** provides a straightforward system for individuals to schedule appointments:
- **Book Appointments**: Reserve a slot with name, email, date, time, and reason.
- **Conflict Prevention**: Prevents double bookings for the same date and time slot (at both application and database levels).
- **Past Date & Time Prevention**: Ensures only future slots can be booked.
- **View Appointments**: Displays all scheduled appointments in neat, clean cards.
- **Cancel Appointments**: Allows users to cancel their booked appointments with immediate UI update and confirmation.
- **Modern Responsive Design**: Built with pure CSS3 using a clean blue & white color palette, responsive for both desktop and mobile screens.

---

## 2. Technology Stack

- **Frontend**:
  - HTML5 & CSS3 (Vanilla CSS with CSS variables, no Tailwind or Bootstrap)
  - JavaScript (ES6+)
  - React.js (Functional components & Hooks: `useState`, `useEffect`)
  - Vite (Fast development server and bundling)
- **Backend**:
  - Node.js (Runtime environment)
  - Express.js (REST API framework)
  - CORS & Dotenv
- **Database**:
  - MongoDB (Document database, local or MongoDB Atlas cloud)
  - Mongoose (Object Data Modeling with schema validation and compound unique indexing)

---

## 3. Project Folder Structure

```text
appointment-scheduling-platform/
  client/
    public/
      index.html                 # HTML template with fonts and metadata
    src/
      main.jsx                   # React entry point
      App.jsx                    # Root component coordinating state & layout
      components/
        Navbar.jsx               # Navigation bar component
        AppointmentForm.jsx      # Form component with validation
        AppointmentList.jsx      # List wrapper handling empty/loading states
        AppointmentCard.jsx      # Single appointment card & cancel action
      styles/
        global.css               # Design tokens, variables & base resets
        App.css                  # Main layout & alert banner styles
        Navbar.css               # Navigation bar styles
        AppointmentForm.css      # Form card & input validation styles
        AppointmentList.css      # List & empty state styles
        AppointmentCard.css      # Card, badge & cancel button styles
      services/
        appointmentService.js    # Backend API communication using fetch()
    index.html                   # Vite root entry
    vite.config.js               # Vite configuration
    package.json                 # Client dependencies & scripts
  server/
    config/
      db.js                      # MongoDB connection setup
    models/
      Appointment.js             # Mongoose schema with unique date/time index
    controllers/
      appointmentController.js   # Request handlers, validation & business logic
    routes/
      appointmentRoutes.js       # Express route definitions
    server.js                    # Express app initialization & server entry
    .env                         # Server environment variables (git-ignored)
    .env.example                 # Example environment template
    package.json                 # Server dependencies & scripts
  .gitignore                     # Git ignore rules for node_modules, .env, dist
  README.md                      # Complete documentation and setup guide
```

---

## 4. REST API Documentation

Base URL: `http://localhost:5000/api/appointments`

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/appointments` | Retrieve all appointments | None | `200 OK` (Array) |
| **POST** | `/api/appointments` | Book a new appointment | `{ name, email, date, time, reason }` | `201 Created` / `400 Bad Request` / `409 Conflict` |
| **DELETE** | `/api/appointments/:id` | Cancel and delete an appointment | None | `200 OK` / `400 Bad Request` / `404 Not Found` |

### Concurrency & Conflict Prevention
1. **Server-Side Validation**: The controller checks `Appointment.findOne({ date, time })` prior to saving.
2. **Database-Level Unique Index**: In `models/Appointment.js`, `appointmentSchema.index({ date: 1, time: 1 }, { unique: true })` ensures atomic uniqueness. Even if two concurrent requests pass the query check simultaneously, MongoDB rejects the second insert with error code `11000` (E11000 duplicate key error), which the controller catches and converts into a friendly HTTP `409 Conflict` response.

---

## 5. Environment Variables

Create a file named `.env` inside the `server/` directory:

```env
# Server Port
PORT=5000

# MongoDB URI (Local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/appointment_scheduler

# Allowed Frontend URL for CORS
CLIENT_URL=http://localhost:5173
```

---

## 6. Step-by-Step Setup Instructions

### Step 1: Clone / Navigate to Project Directory
```bash
cd appointment-scheduling-platform
```

### Step 2: Configure Environment Variables
Inside the `server/` directory, create your `.env` file from `.env.example`:
```bash
cp server/.env.example server/.env
```

### Step 3: Configure MongoDB
You can use either a **Local MongoDB** or **MongoDB Atlas** (Free Cloud Database):

#### Option A: Local MongoDB
1. Ensure MongoDB Community Server is installed and running on your machine:
   ```bash
   # On macOS using Homebrew:
   brew services start mongodb-community
   ```
2. Your `.env` will use the default local URI:
   ```env
   MONGODB_URI=mongodb://localhost:27017/appointment_scheduler
   ```

#### Option B: MongoDB Atlas (Cloud - Free)
1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g., `appUser`) and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** > **Drivers** > Copy the connection string.
6. Replace `<password>` with your database password in `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://appUser:yourPassword@cluster0.mongodb.net/appointment_scheduler?retryWrites=true&w=majority
   ```

### Step 4: Install Dependencies

#### Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

#### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 5: Start the Backend Server
In your first terminal window:
```bash
cd server
npm run dev
# Or: npm start
```
*The server will start on `http://localhost:5000` and display `MongoDB Connected`.*

### Step 6: Start the Frontend Application
In a second terminal window:
```bash
cd client
npm run dev
```
*The Vite development server will start on `http://localhost:5173`.*

---

## 7. How to Test the Application

1. Open your browser and go to `http://localhost:5173`.
2. **Book an Appointment**:
   - Fill in your name, a valid email address, a future date, time, and reason.
   - Click **Book Appointment**.
   - Verify that the success notification appears and the new card appears in the list.
3. **Test Validation**:
   - Attempt to submit the form with empty fields & verify error messages.
   - Attempt to book a past date/time & verify rejection.
4. **Test Conflict Rejection**:
   - Try to book another appointment on the exact same date and time slot.
   - Verify that the server returns a conflict message ("This time slot is already booked").
5. **Test Cancellation**:
   - Click **Cancel Appointment** on an appointment card.
   - Confirm the cancellation alert.
   - Verify the card disappears from the list and a success message is displayed.

---

## 8. College Project Viva / Demo Talking Points

- **Architecture**: Clean 3-tier architecture (Client Tier: React + Vite, Application Tier: Express + Node, Data Tier: MongoDB + Mongoose).
- **Separation of Concerns**: HTML strictly in HTML files, Vanilla CSS strictly in modular `.css` files, API communication isolated in `services/appointmentService.js`, and database logic segregated into models and controllers.
- **Safety**: Client-side validation for instant user feedback paired with rigorous server-side validation to prevent forged requests.
- **Race Condition Handling**: Compound unique index in MongoDB prevents double-booking even when concurrent requests arrive at the exact same millisecond.
