import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 

// Import Auth components (Sign In + Sign Up)
import StudentAuth from './pages/StudentAuth'; 
import TutorAuth from './pages/TutorAuth';

// Import Dashboard components
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import Dashboard from './pages/Dashboard';

// Import Chatbot flow
import OnboardingChatbot from './flows/OnboardingChatbot';


function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Main Landing Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Student Portal - Auth (Sign In / Sign Up) */}
        <Route path="/student/signup" element={<StudentAuth />} />
        <Route path="/student/signin" element={<StudentAuth />} />

        {/* Student Onboarding Chatbot */}
        <Route path="/student/onboard" element={<OnboardingChatbot />} />

        {/* Student Dashboard */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        {/* Tutor Portal - Auth (Sign In / Sign Up) */}
        <Route path="/tutor/signup" element={<TutorAuth />} />
        <Route path="/tutor/signin" element={<TutorAuth />} />
        
        {/* Tutor Dashboard */}
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;