import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTutors: 0,
    totalStudents: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
    assignedTutors: 0,
    unassignedTutors: 0,
    tutors: [],
    students: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard stats from backend
    axios.get("http://localhost:5000/api/dashboard/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data. Make sure backend is running on port 5000.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white text-xl"
          >
            Loading Dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center shadow-2xl"
        >
          <span className="text-6xl mb-4 block">⚠️</span>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-bold"
            >
              🔄 Retry
            </motion.button>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
              >
                ← Back to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.3, 1, 1.3],
          rotate: [360, 180, 0],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"
      />

      <div className="relative z-10">
        {/* Header with Home Button */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
              >
                ← Home
              </motion.button>
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-extrabold text-white drop-shadow-2xl"
          >
            📊 Admin Dashboard
          </motion.h1>
          <div className="w-20"></div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl p-6 text-center text-white"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl font-extrabold mb-2"
            >
              {stats.totalTutors}
            </motion.div>
            <div className="text-xl font-semibold">Total Tutors</div>
            <div className="text-sm mt-2 opacity-80">Verified & Active</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-2xl p-6 text-center text-white"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-5xl font-extrabold mb-2"
            >
              {stats.totalStudents}
            </motion.div>
            <div className="text-xl font-semibold">Total Students</div>
            <div className="text-sm mt-2 opacity-80">Enrolled Learners</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-2xl p-6 text-center text-white"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-5xl font-extrabold mb-2"
            >
              {stats.assignedStudents}
            </motion.div>
            <div className="text-xl font-semibold">Assigned</div>
            <div className="text-sm mt-2 opacity-80">Active Pairings</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-2xl p-6 text-center text-white"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-5xl font-extrabold mb-2"
            >
              {stats.unassignedStudents}
            </motion.div>
            <div className="text-xl font-semibold">Unassigned</div>
            <div className="text-sm mt-2 opacity-80">Awaiting Match</div>
          </motion.div>
        </div>
        
        {/* Detailed Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tutors List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-h-[600px] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6 flex items-center">
              <span className="mr-3">👩‍🏫</span> Tutors
            </h2>
            <div className="space-y-3">
              {stats.tutors && stats.tutors.length > 0 ? (
                stats.tutors.map((tutor, index) => (
                <motion.div
                  key={tutor._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-700 text-lg">{tutor.name}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${tutor.assigned ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {tutor.assigned ? '✓ Assigned' : '○ Available'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{tutor.email}</div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">Subjects:</span> {tutor.subjectDomains?.join(', ') || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">Languages:</span> {tutor.teachingLanguages?.join(', ') || 'N/A'}
                  </div>
                  {tutor.assignedCount > 0 && (
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      Teaching {tutor.assignedCount} student(s)
                    </div>
                  )}
                </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  <span className="text-4xl block mb-2">👩‍🏫</span>
                  <p>No tutors registered yet</p>
                  <Link to="/tutor/signup" className="text-blue-600 hover:underline text-sm">Register as Tutor</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Students List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-h-[600px] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-6 flex items-center">
              <span className="mr-3">🧑‍🎓</span> Students
            </h2>
            <div className="space-y-3">
              {stats.students && stats.students.length > 0 ? (
                stats.students.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.03, x: -5 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-pink-700 text-lg">{student.name}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${student.assigned ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {student.assigned ? '✓ Assigned' : '○ Unassigned'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{student.email}</div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">Topic:</span> {student.learningTopic || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">Language:</span> {student.preferredLanguage || 'N/A'}
                  </div>
                </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  <span className="text-4xl block mb-2">🧑‍🎓</span>
                  <p>No students registered yet</p>
                  <Link to="/student/signup" className="text-pink-600 hover:underline text-sm">Register as Student</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
