import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function StudentSignup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Attempting Sign-up:', formData);
        
        try {
            // Call backend API to save student to MongoDB
            const response = await axios.post(`${API_BASE_URL}/students/signup`, formData);
            console.log('Student saved to DB:', response.data);
            
            alert("Sign-up successful! Now, let's find your perfect tutor.");
            // Redirect to the Chatbot for Onboarding Data Collection
            navigate('/student/onboard', { 
                state: { 
                    studentEmail: formData.email, 
                    studentName: formData.name,
                    studentId: response.data.studentId 
                } 
            }); 
        } catch (error) {
            console.error('Signup error:', error);
            alert(error.response?.data?.message || "Sign-up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 p-4 relative overflow-hidden"> 
            
            {/* Animated background elements */}
            <motion.div 
                animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full opacity-20 blur-3xl"
            />
            <motion.div 
                animate={{ 
                    y: [0, 20, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-10 left-10 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl"
            />
            
            {/* Student-themed floating icons */}
            <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-[15%] text-5xl opacity-70"
            >
                📚
            </motion.div>
            <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-32 right-[20%] text-4xl opacity-60"
            >
                ✏️
            </motion.div>
            <motion.div
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 left-[10%] text-5xl opacity-70"
            >
                🎒
            </motion.div>
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute bottom-20 right-[15%] text-4xl opacity-60"
            >
                📐
            </motion.div>
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                className="absolute top-[40%] left-[5%] text-6xl opacity-50"
            >
                🎓
            </motion.div>
            <motion.div
                animate={{ y: [0, -10, 0], x: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute top-[30%] right-[8%] text-4xl opacity-60"
            >
                💡
            </motion.div>
            
            {/* Form Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
            >
                <motion.h2 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6 text-center"
                >
                    Student Sign Up
                </motion.h2>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Name Input */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-4"
                    >
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                        <input 
                            className="shadow-lg appearance-none border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-cyan-500 focus:bg-white transition-all duration-300" 
                            id="name" type="text" name="name" value={formData.name} onChange={handleChange} required
                        />
                    </motion.div>

                    {/* Email Input */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-4"
                    >
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input 
                            className="shadow-lg appearance-none border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-cyan-500 focus:bg-white transition-all duration-300" 
                            id="email" type="email" name="email" value={formData.email} onChange={handleChange} required
                        />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-6"
                    >
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input 
                            className="shadow-lg appearance-none border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 mb-3 leading-tight focus:outline-none focus:border-cyan-500 focus:bg-white transition-all duration-300" 
                            id="password" type="password" name="password" value={formData.password} onChange={handleChange} required
                        />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex items-center justify-between"
                    >
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-all duration-300 shadow-lg" 
                            type="submit"
                        >
                            Sign Up & Start Onboarding
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}

export default StudentSignup;