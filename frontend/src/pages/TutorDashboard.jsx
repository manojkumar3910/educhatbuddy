import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function TutorDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tutorData, setTutorData] = useState(null);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const tutorId = location.state?.tutorId;
    const tutorName = location.state?.tutorName;
    const status = location.state?.status;

    useEffect(() => {
        const fetchTutorData = async () => {
            if (!tutorId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/dashboard/tutor/${tutorId}`);
                setTutorData(response.data.tutor);
                setAssignedStudents(response.data.assignedStudents);
            } catch (err) {
                console.error('Error fetching tutor data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchTutorData();
    }, [tutorId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        👨‍🏫 Welcome, {tutorName || tutorData?.name || 'Tutor'}!
                    </h1>
                    <p className="text-purple-200">
                        Your Tutor Dashboard
                    </p>
                </motion.div>

                {/* Status Banner */}
                {status === 'pending_verification' && !tutorData?.isVerified && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-yellow-500/20 border border-yellow-400/50 backdrop-blur-lg rounded-2xl p-4 mb-6 text-center"
                    >
                        <p className="text-yellow-100 flex items-center justify-center gap-2">
                            <span className="text-2xl">⏳</span>
                            Your profile is pending verification. Once verified, you'll start receiving student matches!
                        </p>
                    </motion.div>
                )}

                {tutorData?.isVerified && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/20 border border-green-400/50 backdrop-blur-lg rounded-2xl p-4 mb-6 text-center"
                    >
                        <p className="text-green-100 flex items-center justify-center gap-2">
                            <span className="text-2xl">✅</span>
                            Your profile is verified! You can now receive student matches.
                        </p>
                    </motion.div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                    >
                        <div className="text-5xl mb-3">👥</div>
                        <h3 className="text-purple-200 text-sm uppercase tracking-wide">Assigned Students</h3>
                        <p className="text-4xl font-bold text-white">{assignedStudents.length}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                    >
                        <div className="text-5xl mb-3">⭐</div>
                        <h3 className="text-purple-200 text-sm uppercase tracking-wide">Your Rating</h3>
                        <p className="text-4xl font-bold text-white">
                            {tutorData?.rating?.toFixed(1) || '0.0'} 
                            <span className="text-lg text-purple-200">/ 5</span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                    >
                        <div className="text-5xl mb-3">📚</div>
                        <h3 className="text-purple-200 text-sm uppercase tracking-wide">Sessions Completed</h3>
                        <p className="text-4xl font-bold text-white">{tutorData?.totalSessionsCompleted || 0}</p>
                    </motion.div>
                </div>

                {/* Your Profile */}
                {tutorData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>📋</span> Your Profile
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-purple-200 text-sm">Subjects</p>
                                <p className="text-white font-medium">
                                    {tutorData.subjectDomains?.join(', ') || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm">Languages</p>
                                <p className="text-white font-medium">
                                    {tutorData.teachingLanguages?.join(', ') || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm">Available Slots</p>
                                <p className="text-white font-medium">
                                    {tutorData.availableSlots?.join(', ') || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Assigned Students List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>🎓</span> Assigned Students ({assignedStudents.length})
                    </h2>

                    {assignedStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-purple-200 text-lg">No students assigned yet</p>
                            <p className="text-purple-300 text-sm mt-2">
                                {tutorData?.isVerified 
                                    ? "Students will appear here once they select you as their tutor!"
                                    : "Complete verification to start receiving student matches."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assignedStudents.map((student, index) => (
                                <motion.div
                                    key={student._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-white/10 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {student.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{student.name}</h3>
                                                <p className="text-purple-200 text-sm">{student.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                                                {student.learningTopic}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                                        <div>
                                            <span className="text-purple-300">Grade:</span>
                                            <span className="text-white ml-1">{student.grade}</span>
                                        </div>
                                        <div>
                                            <span className="text-purple-300">Mode:</span>
                                            <span className="text-white ml-1">{student.mode}</span>
                                        </div>
                                        <div>
                                            <span className="text-purple-300">Time:</span>
                                            <span className="text-white ml-1">{student.timeOfDay}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all border border-white/30"
                    >
                        ← Back to Home
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default TutorDashboard;
