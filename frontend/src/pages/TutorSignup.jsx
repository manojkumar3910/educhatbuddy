import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function TutorSignup() {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        // Initial fields for the profile form (Step 2)
        subjectDomains: '', // Will be split by commas on the backend
        teachingLanguages: '', 
        availableSlots: '' // e.g., 'Evenings, Weekends'
    });
    const [isProfileStep, setIsProfileStep] = useState(false); // Manages the step in the signup flow
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        // After basic auth, move to the profile collection step
        setIsProfileStep(true);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // --- FINAL PAYLOAD PREPARATION ---
        const finalPayload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            // Send as comma-separated strings - backend will parse
            subjectDomains: formData.subjectDomains,
            teachingLanguages: formData.teachingLanguages,
            availableSlots: formData.availableSlots,
        };

        console.log('--- FINAL TUTOR PROFILE DATA READY ---', finalPayload);

        try {
            // Call backend API to save tutor to MongoDB
            const response = await axios.post(`${API_BASE_URL}/tutors/signup`, finalPayload);
            console.log('Tutor saved to DB:', response.data);
            
            alert("Tutor Profile submitted successfully! Awaiting verification to start matching students.");
            // Redirect to tutor dashboard
            navigate('/tutor/dashboard', { 
                state: { 
                    status: 'pending_verification',
                    tutorId: response.data.teacherId,
                    tutorName: formData.name
                } 
            }); 
        } catch (error) {
            console.error('Tutor signup error:', error);
            alert(error.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600 p-4 relative overflow-hidden"> 
            
            {/* Animated background elements */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full opacity-20 blur-3xl"
            />
            <motion.div 
                animate={{ 
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -90, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-300 rounded-full opacity-20 blur-3xl"
            />
            
            {/* Teacher-themed floating icons */}
            <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 left-[12%] text-5xl opacity-70"
            >
                👨‍🏫
            </motion.div>
            <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-24 right-[15%] text-4xl opacity-60"
            >
                📖
            </motion.div>
            <motion.div
                animate={{ scale: [1, 1.15, 1], y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-28 left-[8%] text-5xl opacity-70"
            >
                🏆
            </motion.div>
            <motion.div
                animate={{ y: [0, 18, 0], x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute bottom-16 right-[12%] text-4xl opacity-60"
            >
                ✨
            </motion.div>
            <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                className="absolute top-[35%] left-[6%] text-5xl opacity-50"
            >
                📝
            </motion.div>
            <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute top-[45%] right-[6%] text-4xl opacity-60"
            >
                🎯
            </motion.div>
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-[40%] right-[10%] text-5xl opacity-50"
            >
                👩‍🏫
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
            >
                <motion.h2 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 text-center"
                >
                    {isProfileStep ? 'Tutor Profile Details' : 'Tutor Sign Up'}
                </motion.h2>

                {!isProfileStep ? (
                    /* === STEP 1: Basic Auth === */
                    <form onSubmit={handleAuthSubmit}>
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-4"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                type="text" name="name" value={formData.name} onChange={handleChange} required/>
                        </motion.div>
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-4"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                type="email" name="email" value={formData.email} onChange={handleChange} required/>
                        </motion.div>
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mb-6"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 mb-3 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                type="password" name="password" value={formData.password} onChange={handleChange} required/>
                        </motion.div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit" 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg w-full transition-all duration-300 shadow-lg"
                        >
                            Continue to Profile
                        </motion.button>
                    </form>
                ) : (
                    /* === STEP 2: Profile Details (Matching/Verification Data) === */
                    <form onSubmit={handleProfileSubmit}>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-sm text-gray-600 mb-4"
                        >
                            Please provide details for student matching and verification.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-4"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Subject Domains</label>
                            <input className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                type="text" name="subjectDomains" value={formData.subjectDomains} onChange={handleChange} required
                                placeholder="(e.g., Physics, Calculus)"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-4"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Teaching Languages</label>
                            <input className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                type="text" name="teachingLanguages" value={formData.teachingLanguages} onChange={handleChange} required
                                placeholder="(e.g., English, Hindi)"
                            />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-6"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Available Slots</label>
                            <input className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                type="text" name="availableSlots" value={formData.availableSlots} onChange={handleChange} required
                                placeholder="(e.g., Evenings, Weekends)"
                            />
                        </motion.div>
                        
                        {/* Mock for Document Verification (Future Step) */}
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mb-6"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Credentials (Mock)</label>
                            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all duration-300"/>
                        </motion.div>


                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit" 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg w-full transition-all duration-300 shadow-lg"
                        >
                            Submit Profile for Verification
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}

export default TutorSignup;