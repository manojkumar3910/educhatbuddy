const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Load environment variables (like MONGO_URI) from .env file
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(cors()); // Enables cross-origin requests from your React frontend

// --- Import Routes ---
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://devamanoj07_db_user:yckjRJ0LRi4X8exv@cluster0.tha0m4k.mongodb.net/';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- Use Routes ---
app.use('/api/students', studentRoutes);
app.use('/api/tutors', teacherRoutes); 
app.use('/api/dashboard', dashboardRoutes); 


// Basic Route for testing
app.get('/', (req, res) => {
    res.send('EduChat Buddy Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}`);
});