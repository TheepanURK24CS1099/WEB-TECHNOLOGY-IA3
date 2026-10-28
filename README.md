# Appointment Scheduling Platform 🗓️

A modern, full-stack appointment scheduling web application built using the **MERN** stack (MongoDB, Express.js, React, Node.js) with Vite.

---

## ✨ Features

- **Book Appointments**: Schedule appointments with name, email, date, time slot, and reason.
- **Double-Booking Prevention**: Validates against conflicting bookings for the same date and time.
- **Past Date & Time Validation**: Ensures appointments can only be booked for future slots.
- **View Appointments**: Responsive list displaying upcoming appointments sorted chronologically.
- **Cancel Bookings**: Cancel scheduled appointments with one click and instant UI refresh.
- **Clean UI**: Responsive layout styled with custom CSS without heavy third-party UI libraries.

---

## 🛠️ Tech Stack

- **Frontend**: React (v18), Vite, Modern CSS3
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: MongoDB (Atlas / Local), Mongoose ODM

---

## 📁 Project Structure

```text
IA3-WEB-TECHNOLOGY/
└── appointment-scheduling-platform/
    ├── client/                 # React + Vite frontend
    │   ├── public/             # Static assets & index.html
    │   ├── src/
    │   │   ├── components/     # Navbar, Form, Card, List components
    │   │   ├── App.jsx         # Main application component
    │   │   └── main.jsx        # React root entry point
    │   └── package.json
    └── server/                 # Node.js + Express backend
        ├── config/             # Database connection (db.js)
        ├── controllers/        # Request handlers & booking logic
        ├── models/             # Mongoose Appointment schema
        ├── routes/             # REST API routes
        ├── server.js           # Server entry point
        ├── .env.example        # Environment variable template
        └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1. Clone the Repository

```bash
git clone https://github.com/TheepanURK24CS1099/WEB-TECHNOLOGY-IA3.git
cd WEB-TECHNOLOGY-IA3
```

---

### 2. Backend Setup

1. Navigate to the server folder:
   ```bash
   cd appointment-scheduling-platform/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Open `.env` and set your MongoDB URI and port:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   > The server will start at `http://localhost:5000`

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd appointment-scheduling-platform/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   > The client will be available at `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API Health Check |
| `GET` | `/api/appointments` | Get all booked appointments |
| `POST` | `/api/appointments` | Create a new appointment |
| `DELETE` | `/api/appointments/:id` | Cancel/delete an appointment |

---

## 👤 Author

- **Theepan** ([@TheepanURK24CS1099](https://github.com/TheepanURK24CS1099))
