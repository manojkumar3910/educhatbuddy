import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function TutorAuth() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [isProfileStep, setIsProfileStep] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        subjectDomains: '',
        teachingLanguages: '', 
        availableSlots: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setIsProfileStep(true);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${API_BASE_URL}/tutors/signup`, formData);
            console.log('Tutor saved to DB:', response.data);
            
            navigate('/tutor/dashboard', { 
                state: { 
                    status: 'pending_verification',
                    tutorId: response.data.teacherId,
                    tutorName: response.data.name
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
            const response = await axios.post(`${API_BASE_URL}/tutors/signin`, {
                email: formData.email,
                password: formData.password
            });
            console.log('Sign in successful:', response.data);
            
            navigate('/tutor/dashboard', { 
                state: { 
                    status: response.data.isVerified ? 'verified' : 'pending_verification',
                    tutorId: response.data.teacherId,
                    tutorName: response.data.name,
                    tutor: response.data.tutor
                } 
            });
        } catch (error) {
            console.error('Signin error:', error);
            setError(error.response?.data?.message || "Sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600 p-4 relative overflow-hidden"> 
            
            {/* Animated background elements */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full opacity-20 blur-3xl"
            />
            <motion.div 
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
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
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-[40%] right-[10%] text-5xl opacity-50"
            >
                👩‍🏫
            </motion.div>
            
            {/* Form Container */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
            >
                {/* Toggle Tabs - Only show when not in profile step */}
                {!isProfileStep && (
                    <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => { setIsSignUp(true); setError(''); }}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                isSignUp 
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => { setIsSignUp(false); setError(''); }}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                !isSignUp 
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Sign In
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* SIGN IN FORM */}
                    {!isSignUp && !isProfileStep && (
                        <motion.div
                            key="signin"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2 text-center">
                                Welcome Back
                            </h2>
                            <p className="text-gray-500 text-center mb-6">
                                Sign in to manage your students
                            </p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                            
                            <form onSubmit={handleSignIn}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                    }`}
                                    type="submit"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing In...
                                        </span>
                                    ) : 'Sign In'}
                                </motion.button>
                            </form>

                            <p className="text-center text-gray-600 mt-6">
                                Don't have an account?{' '}
                                <button 
                                    onClick={() => { setIsSignUp(true); setError(''); }}
                                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* SIGN UP - STEP 1: Basic Auth */}
                    {isSignUp && !isProfileStep && (
                        <motion.div
                            key="signup-step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2 text-center">
                                Create Account
                            </h2>
                            <p className="text-gray-500 text-center mb-6">
                                Join as a tutor and help students learn
                            </p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                            
                            <form onSubmit={handleAuthSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg"
                                >
                                    Continue to Profile →
                                </motion.button>
                            </form>

                            <p className="text-center text-gray-600 mt-6">
                                Already have an account?{' '}
                                <button 
                                    onClick={() => { setIsSignUp(false); setError(''); }}
                                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                                >
                                    Sign In
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* SIGN UP - STEP 2: Profile Details */}
                    {isSignUp && isProfileStep && (
                        <motion.div
                            key="signup-step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2 text-center">
                                Profile Details
                            </h2>
                            <p className="text-gray-500 text-center mb-6">
                                Tell us about your teaching expertise
                            </p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                            
                            <form onSubmit={handleSignUp}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Subject Domains</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="text" 
                                        name="subjectDomains" 
                                        value={formData.subjectDomains} 
                                        onChange={handleChange} 
                                        placeholder="e.g., Math, Physics, Chemistry"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple subjects with commas</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Teaching Languages</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="text" 
                                        name="teachingLanguages" 
                                        value={formData.teachingLanguages} 
                                        onChange={handleChange} 
                                        placeholder="e.g., English, Hindi"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Available Slots</label>
                                    <input 
                                        className="shadow-lg border-2 border-transparent bg-gray-50 rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300" 
                                        type="text" 
                                        name="availableSlots" 
                                        value={formData.availableSlots} 
                                        onChange={handleChange} 
                                        placeholder="e.g., Morning, Evening, Weekends"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setIsProfileStep(false)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-all duration-300"
                                    >
                                        ← Back
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading}
                                        type="submit" 
                                        className={`flex-1 font-bold py-3 rounded-lg transition-all duration-300 shadow-lg text-white ${
                                            loading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                        }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Creating...
                                            </span>
                                        ) : 'Complete Sign Up'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    )}
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

export default TutorAuth;
