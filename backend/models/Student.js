const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Basic Auth Fields
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    
    // Preferences & Info (collected by the Chatbot)
    grade: { type: String },
    phoneNumber: { type: String },
    
    learningTopic: { type: String, default: null }, // CRITICAL for matching (academic1)
    educationalBoard: { type: String },
    exams: { type: String },
    
    tutorGender: { type: String, enum: ["Male", "Female", "No Preference"] },
    preferredLanguage: { type: String, default: null }, // CRITICAL for matching (tutor2)
    mode: { type: String, enum: ["Online", "Offline", "Hybrid"] },
    sessionType: { type: String, enum: ["Group", "Individual"] },

    daysPerWeek: { type: Number },
    timeOfDay: { type: String, default: null }, // CRITICAL for matching (schedule2)
    classDuration: { type: String },
    weekPreference: { type: String },
    
    learningStyle: { type: String },
    wantsAssignments: { type: String },

    // Relationship
    currentTutor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Teacher', 
        default: null 
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);