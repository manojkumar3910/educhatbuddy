import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function StudentDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [matchedTutors, setMatchedTutors] = useState(location.state?.tutors || []);
    const [studentProfile, setStudentProfile] = useState(location.state?.student || null);
    const [assignedTutor, setAssignedTutor] = useState(null);
    const [assigning, setAssigning] = useState(false);
    
    // Fallback if data is missing (e.g., user navigated directly)
    if (!matchedTutors.length && !assignedTutor) {
        return (
            <div className="min-h-screen p-8 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-md text-center"
                >
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-3xl font-bold mb-4 text-red-600">No Tutor Matches Found</h1>
                    <p className="text-gray-700 mb-6">Please complete the onboarding chat to find your best matches.</p>
                    <button
                        onClick={() => navigate('/student/signup')}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl"
                    >
                        Start Onboarding
                    </button>
                </motion.div>
            </div>
        );
    }

    // Sort tutors by score (highest first) - they should already be sorted but ensure it
    const sortedTutors = [...matchedTutors].sort((a, b) => (b.score || 0) - (a.score || 0));
    const topRecommended = sortedTutors[0];
    
    const handleAssignTutor = async (tutor) => {
        if (!studentProfile || !studentProfile._id) {
            alert("Error: Student ID is missing. Cannot assign tutor.");
            return;
        }

        setAssigning(true);
        try {
            await axios.post(`${API_BASE_URL}/tutors/assign`, {
                studentId: studentProfile._id,
                tutorId: tutor._id
            });
            setAssignedTutor(tutor);
            setMatchedTutors([]); // Clear the list after assignment
        } catch (error) {
            alert(`Assignment Failed. Please check the backend connection.`);
            console.error("Assignment Error:", error);
        } finally {
            setAssigning(false);
        }
    };

    // Success screen after assignment
    if (assignedTutor) {
        return (
            <div className="min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center relative overflow-hidden">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full opacity-20 blur-3xl"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white bg-opacity-95 p-10 rounded-3xl shadow-2xl max-w-lg text-center"
                >
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="text-8xl mb-6"
                    >
                        🎉
                    </motion.div>
                    <h1 className="text-4xl font-bold text-green-600 mb-4">Tutor Assigned!</h1>
                    <p className="text-gray-600 text-lg mb-6">
                        You have been matched with <span className="font-bold text-gray-800">{assignedTutor.name}</span>
                    </p>
                    
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <p className="text-green-800 font-medium">
                            📚 Subjects: {assignedTutor.subjectDomains?.join(', ')}
                        </p>
                        <p className="text-green-700 text-sm mt-2">
                            Match Score: {assignedTutor.score} points
                        </p>
                    </div>
                    
                    <p className="text-gray-500 mb-6">
                        Your tutor will contact you shortly to schedule your first session.
                    </p>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div 
                animate={{ x: [0, 100, 0], y: [0, -100, 0], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl"
            />
            <motion.div 
                animate={{ x: [0, -100, 0], y: [0, 100, 0], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl"
            />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.h1 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg"
                >
                    Welcome, {studentProfile?.name || 'Student'}! 🎓
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-xl text-pink-100 mb-8"
                >
                    We found <span className="font-bold text-yellow-300">{sortedTutors.length} tutors</span> matching your preferences. Choose your EduChat Buddy!
                </motion.p>

                {/* Top Recommended Section */}
                {topRecommended && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">⭐</span>
                            <h2 className="text-2xl font-bold text-yellow-300">Top Recommended</h2>
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">BEST MATCH</span>
                        </div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 p-1 rounded-3xl shadow-2xl"
                        >
                            <div className="bg-white rounded-3xl p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            {topRecommended.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{topRecommended.name}</h3>
                                            <p className="text-gray-600">
                                                📚 {topRecommended.subjectDomains?.join(', ')}
                                            </p>
                                            {topRecommended.teachingLanguages && (
                                                <p className="text-gray-500 text-sm">
                                                    🗣️ {topRecommended.teachingLanguages?.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        {/* Score Badge */}
                                        <div className="text-center">
                                            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                                                {topRecommended.score}
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide">Match Score</div>
                                        </div>
                                        
                                        {/* Match indicators */}
                                        <div className="flex gap-2">
                                            {topRecommended.matchDetails?.topic && (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✓ Topic</span>
                                            )}
                                            {topRecommended.matchDetails?.language && (
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">✓ Language</span>
                                            )}
                                            {topRecommended.matchDetails?.time && (
                                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">✓ Time</span>
                                            )}
                                        </div>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={assigning}
                                            onClick={() => handleAssignTutor(topRecommended)}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50"
                                        >
                                            {assigning ? 'Assigning...' : '✓ Choose This Tutor'}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Other Matches */}
                {sortedTutors.length > 1 && (
                    <>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>👥</span> Other Matches
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedTutors.slice(1).map((tutor, index) => (
                                <motion.div 
                                    key={tutor._id} 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {tutor.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                                                <p className="text-gray-500 text-sm">#{index + 2} Match</p>
                                            </div>
                                        </div>
                                        {/* Score */}
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">{tutor.score}</div>
                                            <div className="text-xs text-gray-400">points</div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-3 text-sm">
                                        📚 {tutor.subjectDomains?.join(', ')}
                                    </p>
                                    
                                    {/* Match Breakdown */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <MatchBadge label="Topic" matched={tutor.matchDetails?.topic} />
                                        <MatchBadge label="Language" matched={tutor.matchDetails?.language} />
                                        <MatchBadge label="Time" matched={tutor.matchDetails?.time} />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={assigning}
                                        onClick={() => handleAssignTutor(tutor)}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-2.5 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                                    >
                                        Select Tutor
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

// Match badge component
const MatchBadge = ({ label, matched }) => (
    <span className={`text-xs px-2 py-1 rounded-full ${
        matched 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-400'
    }`}>
        {matched ? '✓' : '✗'} {label}
    </span>
);

export default StudentDashboard;