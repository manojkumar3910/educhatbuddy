import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EduChatLogo from '../assets/Logo.png'; 

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 
                    bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      
      {/* Animated background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          x: [0, -50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10 blur-2xl"
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`
          }}
        />
      ))}

      {/* Main Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-2xl"
      >
        
        {/* Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
        >
          EduChat Buddy
        </motion.h1>
        
        {/* Tagline */}
        <motion.p 
          variants={itemVariants}
          className="text-2xl md:text-3xl text-pink-200 italic mb-8 drop-shadow-lg"
        >
          AI-Driven Learning Assistant
        </motion.p>
        
        {/* Logo - Centered below tagline */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-12"
        >
          <motion.img 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            src={EduChatLogo} 
            alt="EduChat Buddy Logo" 
            className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl cursor-pointer"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }}
          />
        </motion.div>

        {/* Portal Buttons */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {/* Student Portal */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/student/signup" 
              className="block w-full py-5 px-6 text-lg font-bold rounded-2xl
                         bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                         text-white text-center shadow-2xl hover:shadow-yellow-500/50 
                         transition-all duration-300 border border-white/20"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mr-2 text-2xl"
              >
                🧑‍🎓
              </motion.span>
              <span className="block text-xl font-extrabold">Student</span>
              <span className="text-sm opacity-80">Find Your Tutor</span>
            </Link>
          </motion.div>

          {/* Tutor Portal */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/tutor/signup" 
              className="block w-full py-5 px-6 text-lg font-bold rounded-2xl
                         bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 
                         text-white text-center shadow-2xl hover:shadow-indigo-500/50 
                         transition-all duration-300 border border-white/20"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="inline-block mr-2 text-2xl"
              >
                👩‍🏫
              </motion.span>
              <span className="block text-xl font-extrabold">Tutor</span>
              <span className="text-sm opacity-80">Start Teaching</span>
            </Link>
          </motion.div>

          {/* Admin Dashboard */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/dashboard" 
              className="block w-full py-5 px-6 text-lg font-bold rounded-2xl
                         bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 
                         text-white text-center shadow-2xl hover:shadow-pink-500/50 
                         transition-all duration-300 border border-white/20"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="inline-block mr-2 text-2xl"
              >
                📊
              </motion.span>
              <span className="block text-xl font-extrabold">Dashboard</span>
              <span className="text-sm opacity-80">Admin Panel</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          variants={itemVariants}
          className="mt-12 text-white/60 text-sm"
        >
          Connect with the perfect tutor • Learn smarter, not harder
        </motion.p>

      </motion.div>
    </div>
  );
}

export default HomePage;