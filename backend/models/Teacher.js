const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    // Basic Auth Fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    
    // Verification Status (Crucial for Matching)
    isVerified: { type: Boolean, default: false }, 
    
    // Matching Data (collected in Profile Details Form)
    subjectDomains: [{ type: String, required: true }],
    teachingLanguages: [{ type: String, required: true }],
    availableSlots: [{ type: String, required: true }],
    
    // Rating & Experience (for weighted scoring)
    rating: { type: Number, default: 0, min: 0, max: 5 },      // Average rating (0-5 scale)
    totalRatings: { type: Number, default: 0 },                 // Number of ratings received
    yearsOfExperience: { type: Number, default: 0 },            // Years of teaching experience
    totalSessionsCompleted: { type: Number, default: 0 },       // Total sessions conducted
    
    // Relationship
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);