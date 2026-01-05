import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function StudentAuth() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${API_BASE_URL}/students/signup`, formData);
            console.log('Student saved to DB:', response.data);
            
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
            setError(error.response?.data?.message || "Sign-up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${API_BASE_URL}/students/signin`, {
                email: formData.email,
                password: formData.password
            });
            console.log('Sign in successful:', response.data);
            
            // Check if student has completed onboarding
            if (response.data.isOnboarded) {
                // Go to dashboard
                navigate('/student/dashboard', { 
                    state: { 
                        student: response.data.student,
                        tutors: [] // Will need to fetch matches again
                    } 
                });
            } else {
                // Go to onboarding
                navigate('/student/onboard', { 
                    state: { 
                        studentEmail: response.data.email, 
                        studentName: response.data.name,
                        studentId: response.data.studentId 
                    } 
                });
            }
        } catch (error) {
            console.error('Signin error:', error);
            setError(error.response?.data?.message || "Sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 p-4 relative overflow-hidden"> 
            
            {/* Animated background elements */}
            <motion.div 
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full opacity-20 blur-3xl"
            />
            <motion.div 
                animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
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
                {/* Toggle Tabs */}
                <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => { setIsSignUp(true); setError(''); }}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            isSignUp 
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => { setIsSignUp(false); setError(''); }}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            !isSignUp 
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Sign In
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSignUp ? 'signup' : 'signin'}
                        initial={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2 text-center">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-500 text-center mb-6">
                            {isSignUp ? 'Start your learning journey today' : 'Sign in to continue learning'}
                        </p>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        
                        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                            
                            {/* Name Input - Only for Sign Up */}
                            {isSignUp && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4"
                                >
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input 
                                        className="shadow-lg appearance-none border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-cyan-500 focus:bg-white transition-all duration-300" 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="Enter your full name"
                                        required={isSignUp}
                                    />
                                </motion.div>
                            )}

                            {/* Email Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input 
                                    className="shadow-lg appearance-none border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-cyan-500 focus:bg-white transition-all duration-300" 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <input 
                                    className="shadow-lg appearance-none border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-cyan-500 focus:bg-white transition-all duration-300" 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                }`}
                                type="submit"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                                    </span>
                                ) : (
                                    isSignUp ? 'Sign Up & Start Learning' : 'Sign In'
                                )}
                            </motion.button>
                        </form>

                        {/* Switch prompt */}
                        <p className="text-center text-gray-600 mt-6">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                            <button 
                                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Back to Home */}
                <div className="text-center mt-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default StudentAuth;
