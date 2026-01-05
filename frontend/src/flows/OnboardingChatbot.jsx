import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; 

// --- Configuration: The Chatbot's Rules (Your Questions) ---
const CHAT_RULES = [
    { id: 'contact1', prompt: "Welcome! To confirm, what is your full name?", field: "fullName", type: "text", icon: "👋" },
    { id: 'contact2', prompt: "Which grade or class are you currently in?", field: "grade", type: "text", icon: "📚" },
    { id: 'contact3', prompt: "What is your best contact phone number (10 digits)?", field: "phoneNumber", type: "number", icon: "📱" },
    { id: 'academic1', prompt: "Which subject do you primarily need help with?", field: "learningTopic", type: "options", options: ["Math", "Physics", "English", "Computer Science", "Chemistry", "Biology", "Other"], icon: "🎯" },
    { id: 'academic2', prompt: "Which educational board are you studying under?", field: "educationalBoard", type: "options", options: ["CBSE", "ICSE", "State Board", "IB", "Other"], icon: "🏫" },
    { id: 'academic3', prompt: "Are you preparing for any specific entrance exams?", field: "exams", type: "options", options: ["JEE", "NEET", "Board Exams", "None"], icon: "📝" },
    { id: 'tutor1', prompt: "Do you prefer a male or female tutor?", field: "tutorGender", type: "options", options: ["Male", "Female", "No Preference"], icon: "👤" },
    { id: 'tutor2', prompt: "What is your preferred language of instruction?", field: "preferredLanguage", type: "options", options: ["English", "Hindi", "Tamil", "Telugu", "Any"], icon: "🗣️" },
    { id: 'tutor3', prompt: "Do you prefer online, offline, or hybrid classes?", field: "mode", type: "options", options: ["Online", "Offline", "Hybrid"], icon: "💻" },
    { id: 'tutor4', prompt: "Do you want group or individual tutoring sessions?", field: "sessionType", type: "options", options: ["Group", "Individual"], icon: "👥" },
    { id: 'schedule1', prompt: "How many days per week would you ideally like classes?", field: "daysPerWeek", type: "number", icon: "📅" },
    { id: 'schedule2', prompt: "Do you prefer morning, afternoon, or evening classes?", field: "timeOfDay", type: "options", options: ["Morning (8-12 AM)", "Afternoon (1-4 PM)", "Evening (5-9 PM)"], icon: "🕐" },
    { id: 'schedule3', prompt: "How long should each class be?", field: "classDuration", type: "options", options: ["30 minutes", "1 hour", "90 minutes"], icon: "⏱️" },
    { id: 'schedule4', prompt: "Are you looking for Weekday, Weekend, or Both?", field: "weekPreference", type: "options", options: ["Weekdays Only", "Weekends Only", "Both"], icon: "📆" },
    { id: 'style1', prompt: "What is your preferred learning style?", field: "learningStyle", type: "options", options: ["Visual", "Audio", "Reading/Writing", "Kinesthetic"], icon: "🧠" },
    { id: 'style2', prompt: "Do you want tests and assignments from your tutor?", field: "wantsAssignments", type: "options", options: ["Yes", "No"], icon: "✅" },
];

const API_BASE_URL = 'http://localhost:5000/api';

// --- Dedicated function to execute API calls (called when data is complete) ---
const executeMatchEngine = async (finalPayload, navigate, setLoading) => {
    try {
        console.log("Final Payload being SENT:", finalPayload);

        // 1. Post the full profile data to Express backend
        const onboardResponse = await axios.post(`${API_BASE_URL}/students/onboard`, finalPayload);
        
        // **CRITICAL MATCHING DATA EXTRACTION**
        const matchData = {
            learningTopic: finalPayload.learningTopic,
            preferredLanguage: finalPayload.preferredLanguage,
            timeOfDay: finalPayload.timeOfDay,
        };

        // 2. Call the Tutor Matching Engine
        const matchResponse = await axios.get(`${API_BASE_URL}/tutors/match`, {
            params: matchData
        });
        
        const matchedTutors = matchResponse.data;
        console.log("Tutor Match Results:", matchedTutors);

        alert("Matching complete! We found your EduChat Buddies!");
        
        // 3. Redirect to the Dashboard/Results page with match data
        navigate('/student/dashboard', { state: { tutors: matchedTutors, student: onboardResponse.data.student } });

    } catch (error) {
        console.error("API Error during Onboarding/Match:", error.response ? error.response.data : error.message);
        alert("Match failed. Check console for details.");
    } finally {
        setLoading(false);
    }
};


function OnboardingChatbot() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const initialData = { 
        email: location.state?.studentEmail,
    };

    const [currentStep, setCurrentStep] = useState(0);
    const [preferences, setPreferences] = useState(initialData);
    const [textInputValue, setTextInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const step = CHAT_RULES[currentStep];

    // --- SYNCHRONIZED ANSWER HANDLER (The Fix) ---
    const handleAnswer = (field, value) => {
        setLoading(true);

        const newPreferences = { ...preferences, [field]: value };
        
        // 1. Check if this is the final question (index 15)
        if (currentStep === CHAT_RULES.length - 1) {
            // It's the FINAL answer: DO NOT USE ASYNCHRONOUS setPreferences
            
            // Execute the final API call logic using the fully updated payload
            executeMatchEngine(newPreferences, navigate, setLoading);
            
            // Note: We intentionally avoid setting preferences here to prevent a race condition,
            // as the API call uses the newPreferences variable directly.
            
        } else {
            // 2. Not the final answer: Move to the next question
            setPreferences(newPreferences); // Regular asynchronous update
            setTextInputValue('');
            
            setTimeout(() => { 
                setCurrentStep(currentStep + 1);
                setLoading(false);
            }, 300);
        }
    };
    
    // Handles text input submission (used for name, grade, phone number)
    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (textInputValue.trim()) {
            handleAnswer(step.field, textInputValue.trim());
        }
    };
    
    // Handles navigation back to previous question
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        setTextInputValue(''); 
    };


    // Safety check for missing initial data
    if (!initialData.email && currentStep > 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white text-2xl p-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
                >
                    <span className="text-6xl mb-4 block">⚠️</span>
                    Error: Authentication data missing. Please sign up again.
                </motion.div>
            </div>
        );
    }
    
    // Loading state renderer - Clean, static, centered layout
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <div className="flex flex-col items-center justify-center text-center px-4">
                    {/* Logo - Static, bigger */}
                    <div className="text-8xl mb-6">
                        🎓
                    </div>
                    
                    {/* Simple loading spinner - no bouncing */}
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
                    
                    {/* Text - Straight alignment, no animation */}
                    <p className="text-white text-2xl font-semibold text-center mb-2">
                        {currentStep < CHAT_RULES.length - 1 ? 'Processing Answer...' : '✨ Finding Your Match...'}
                    </p>
                    
                    {currentStep >= CHAT_RULES.length - 1 && (
                        <p className="text-pink-200 text-sm text-center">
                            Analyzing your preferences to find the perfect tutor
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (!step) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white text-3xl font-bold text-center"
                >
                    <span className="text-6xl block mb-4">🔍</span>
                    Finding your perfect EduChat Buddy...
                </motion.div>
            </div>
        );
    }

    // Animation variants
    const questionVariants = {
        hidden: { opacity: 0, x: -50, scale: 0.9 },
        visible: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 100,
                damping: 15
            }
        },
        exit: { 
            opacity: 0, 
            x: 50, 
            scale: 0.9,
            transition: { duration: 0.3 }
        }
    };

    const optionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.1 + i * 0.08, duration: 0.4 }
        })
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 relative overflow-hidden">
            
            {/* Animated background */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div 
                animate={{ 
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0]
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"
            />

            <div className="w-full max-w-2xl relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">🎓 EduChat Buddy</h2>
                    <p className="text-pink-100 mt-1">Let's find your perfect tutor!</p>
                </motion.div>

                {/* Main Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
                >
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Question {currentStep + 1} of {CHAT_RULES.length}</span>
                            <span>{Math.round(((currentStep + 1) / CHAT_RULES.length) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / CHAT_RULES.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            />
                        </div>
                    </div>

                    {/* Question Area with Animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            variants={questionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Question Bubble */}
                            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 rounded-2xl rounded-tl-none mb-6 shadow-lg">
                                <div className="flex items-start gap-3">
                                    <motion.span 
                                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.5 }}
                                        className="text-3xl"
                                    >
                                        {step.icon}
                                    </motion.span>
                                    <p className="text-white font-medium text-lg">{step.prompt}</p>
                                </div>
                            </div>

                            {/* Options/Input Area */}
                            <div className="mb-6">
                                {step.type === 'options' && step.options ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {step.options.map((option, index) => (
                                            <motion.button
                                                key={option}
                                                custom={index}
                                                variants={optionVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover={{ scale: 1.05, y: -3 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAnswer(step.field, option)}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                                                           text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 
                                                           shadow-lg hover:shadow-xl border border-white/20"
                                            >
                                                {option}
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.form 
                                        onSubmit={handleTextSubmit} 
                                        className="flex gap-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <input
                                            type={step.type}
                                            placeholder={`Enter your ${step.field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                                            value={textInputValue}
                                            onChange={(e) => setTextInputValue(e.target.value)}
                                            className="flex-grow p-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white 
                                                       focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300
                                                       text-lg"
                                            required
                                            autoFocus
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                                                       text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg font-bold"
                                        >
                                            Send ➤
                                        </motion.button>
                                    </motion.form>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        {currentStep > 0 ? (
                            <motion.button
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBack}
                                className="text-gray-600 hover:text-purple-600 transition-colors font-semibold flex items-center gap-2"
                            >
                                ← Back
                            </motion.button>
                        ) : (
                            <div></div>
                        )}
                        <div className="flex gap-1">
                            {CHAT_RULES.map((_, index) => (
                                <motion.div
                                    key={index}
                                    animate={{ 
                                        scale: index === currentStep ? 1.3 : 1,
                                        backgroundColor: index <= currentStep ? '#8B5CF6' : '#E5E7EB'
                                    }}
                                    className="w-2 h-2 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default OnboardingChatbot;