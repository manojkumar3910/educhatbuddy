const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
const Teacher = require('../models/Teacher'); 

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // Fetch all students and teachers
        const students = await Student.find();
        const tutors = await Teacher.find();

        // Calculate statistics
        const totalStudents = students.length;
        const totalTutors = tutors.length;

        // Count assigned/unassigned students (students with currentTutor field)
        const assignedStudents = students.filter(s => s.currentTutor).length;
        const unassignedStudents = totalStudents - assignedStudents;

        // Count assigned/unassigned tutors (tutors with assignedStudents array)
        const assignedTutors = tutors.filter(t => t.assignedStudents && t.assignedStudents.length > 0).length;
        const unassignedTutors = totalTutors - assignedTutors;

        // Format student and tutor details
        const studentDetails = students.map(s => ({
            _id: s._id,
            name: s.name,
            email: s.email,
            assigned: !!s.currentTutor,
            learningTopic: s.learningTopic || 'N/A',
            preferredLanguage: s.preferredLanguage || 'N/A'
        }));

        const tutorDetails = tutors.map(t => ({
            _id: t._id,
            name: t.name,
            email: t.email,
            assigned: t.assignedStudents && t.assignedStudents.length > 0,
            assignedCount: t.assignedStudents ? t.assignedStudents.length : 0,
            subjectDomains: t.subjectDomains || [],
            teachingLanguages: t.teachingLanguages || [],
            isVerified: t.isVerified
        }));

        res.status(200).json({
            totalStudents,
            totalTutors,
            assignedStudents,
            unassignedStudents,
            assignedTutors,
            unassignedTutors,
            students: studentDetails,
            tutors: tutorDetails
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics.', error: error.message });
    }
});

// GET /api/dashboard/tutor/:tutorId - Get tutor-specific dashboard data
router.get('/tutor/:tutorId', async (req, res) => {
    try {
        const { tutorId } = req.params;
        
        // Find tutor and populate assigned students
        const tutor = await Teacher.findById(tutorId).populate('assignedStudents');
        
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found.' });
        }

        // Get assigned students with details
        const assignedStudents = tutor.assignedStudents.map(student => ({
            _id: student._id,
            name: student.name,
            email: student.email,
            learningTopic: student.learningTopic || 'N/A',
            preferredLanguage: student.preferredLanguage || 'N/A',
            grade: student.grade || 'N/A',
            mode: student.mode || 'N/A',
            timeOfDay: student.timeOfDay || 'N/A'
        }));

        res.status(200).json({
            tutor: {
                _id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                isVerified: tutor.isVerified,
                rating: tutor.rating,
                totalRatings: tutor.totalRatings,
                totalSessionsCompleted: tutor.totalSessionsCompleted,
                subjectDomains: tutor.subjectDomains,
                teachingLanguages: tutor.teachingLanguages,
                availableSlots: tutor.availableSlots
            },
            assignedStudents,
            totalAssigned: assignedStudents.length
        });
    } catch (error) {
        console.error('Error fetching tutor dashboard:', error);
        res.status(500).json({ message: 'Failed to fetch tutor data.', error: error.message });
    }
});

// GET /api/dashboard/tutor-by-email/:email - Get tutor dashboard by email
router.get('/tutor-by-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        // Find tutor by email and populate assigned students
        const tutor = await Teacher.findOne({ email }).populate('assignedStudents');
        
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found.' });
        }

        // Get assigned students with details
        const assignedStudents = tutor.assignedStudents.map(student => ({
            _id: student._id,
            name: student.name,
            email: student.email,
            learningTopic: student.learningTopic || 'N/A',
            preferredLanguage: student.preferredLanguage || 'N/A',
            grade: student.grade || 'N/A',
            mode: student.mode || 'N/A',
            timeOfDay: student.timeOfDay || 'N/A'
        }));

        res.status(200).json({
            tutor: {
                _id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                isVerified: tutor.isVerified,
                rating: tutor.rating,
                totalRatings: tutor.totalRatings,
                totalSessionsCompleted: tutor.totalSessionsCompleted,
                subjectDomains: tutor.subjectDomains,
                teachingLanguages: tutor.teachingLanguages,
                availableSlots: tutor.availableSlots
            },
            assignedStudents,
            totalAssigned: assignedStudents.length
        });
    } catch (error) {
        console.error('Error fetching tutor dashboard:', error);
        res.status(500).json({ message: 'Failed to fetch tutor data.', error: error.message });
    }
});

module.exports = router;
