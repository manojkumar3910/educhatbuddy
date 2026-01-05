const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 

// POST /api/students/signup - Handles student sign-up (basic auth)
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if student already exists
        let student = await Student.findOne({ email });
        
        if (student) {
            return res.status(400).json({ 
                message: 'An account with this email already exists. Please sign in.',
                exists: true
            });
        }
        
        // Create new student
        student = await Student.create({ email, password, name });
        
        res.status(201).json({ 
            message: 'Account created successfully! Proceed to onboarding.', 
            studentId: student._id,
            email: student.email,
            name: student.name
        });

    } catch (error) {
        console.error('Error during student signup:', error);
        res.status(400).json({ message: 'Signup failed.', error: error.message });
    }
});

// POST /api/students/signin - Handles student sign-in
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find student by email
        const student = await Student.findOne({ email });
        
        if (!student) {
            return res.status(404).json({ 
                message: 'No account found with this email. Please sign up first.',
                exists: false
            });
        }
        
        // Check password (simple comparison - in production use bcrypt)
        if (student.password !== password) {
            return res.status(401).json({ 
                message: 'Incorrect password. Please try again.'
            });
        }
        
        // Check if onboarding is complete (has learningTopic)
        const isOnboarded = !!student.learningTopic;
        
        res.status(200).json({ 
            message: 'Sign in successful!', 
            studentId: student._id,
            email: student.email,
            name: student.name,
            isOnboarded,
            student: student
        });

    } catch (error) {
        console.error('Error during student signin:', error);
        res.status(500).json({ message: 'Sign in failed.', error: error.message });
    }
});

// POST /api/students/onboard - Updates profile with data from the Chatbot
router.post('/onboard', async (req, res) => {
    try {
        // Collect email and all preferences sent from the chatbot
        const { email, ...preferences } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required for onboarding.' });
        }

        const updatePayload = { ...preferences };
        if (preferences.fullName) {
            updatePayload.name = preferences.fullName;
            delete updatePayload.fullName;
        }

        // Find student and update the profile with all preferences
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: updatePayload },
            { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!student) {
             return res.status(404).json({ message: 'Student not found.' });
        }

        res.status(200).json({ 
            message: 'Onboarding complete. Ready for tutor match.', 
            student: student 
        });

    } catch (error) {
        console.error('Error during student onboarding:', error);
        res.status(400).json({ message: 'Failed to save preferences.', error: error.message });
    }
});

module.exports = router;