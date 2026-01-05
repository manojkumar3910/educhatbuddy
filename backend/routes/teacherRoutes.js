const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher'); 
const Student = require('../models/Student'); 

// ============================================================================
// CONFIGURATION: Matching Algorithm Weights & Settings
// ============================================================================
// These weights can be easily adjusted or loaded from config/database for A/B testing
// or future ML-based optimization. Total weights should sum to 1.0 for normalized scoring.

const MATCHING_CONFIG = {
    weights: {
        topic: 0.5,          // Subject/Topic match - highest priority
        language: 0.2,       // Language preference match
        time: 0.2,           // Time availability match
        rating: 0.1          // Tutor rating/experience score
    },
    maxResults: 5,           // Maximum number of tutors to return
    minScoreThreshold: 0.3   // Minimum score to be considered a valid match (0-1)
};

// ============================================================================
// UTILITY FUNCTIONS: Matching Logic Helpers
// ============================================================================

/**
 * Normalizes a string for comparison (lowercase, trimmed)
 * @param {string} str - Input string
 * @returns {string} - Normalized string
 */
const normalizeString = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().trim();
};

/**
 * Checks if student's preferred topic matches any of the tutor's subject domains
 * Uses fuzzy matching - checks if topic is contained in domain or vice versa
 * @param {Array<string>} tutorSubjects - Tutor's subject domains
 * @param {string} studentTopic - Student's learning topic preference
 * @returns {boolean} - True if there's a topic match
 */
const checkTopicMatch = (tutorSubjects, studentTopic) => {
    if (!Array.isArray(tutorSubjects) || !studentTopic) return false;
    
    const normalizedTopic = normalizeString(studentTopic);
    
    return tutorSubjects.some(subject => {
        const normalizedSubject = normalizeString(subject);
        // Check both directions for flexible matching
        return normalizedSubject.includes(normalizedTopic) || 
               normalizedTopic.includes(normalizedSubject);
    });
};

/**
 * Checks if student's preferred language matches tutor's teaching languages
 * @param {Array<string>} tutorLanguages - Tutor's teaching languages
 * @param {string} studentLanguage - Student's preferred language
 * @returns {boolean} - True if there's a language match
 */
const checkLanguageMatch = (tutorLanguages, studentLanguage) => {
    if (!Array.isArray(tutorLanguages) || !studentLanguage) return false;
    
    const normalizedPref = normalizeString(studentLanguage);
    
    // "Any" language preference always matches
    if (normalizedPref === 'any') return true;
    
    return tutorLanguages.some(lang => {
        const normalizedLang = normalizeString(lang);
        return normalizedLang.includes(normalizedPref) || 
               normalizedPref.includes(normalizedLang);
    });
};

/**
 * Checks if student's preferred time matches tutor's availability slots
 * Handles flexible time slot descriptions (e.g., "Evening", "5-9 PM", "after 5")
 * @param {Array<string>} tutorSlots - Tutor's available time slots
 * @param {string} studentTime - Student's preferred time of day
 * @returns {boolean} - True if there's a time match
 */
const checkTimeMatch = (tutorSlots, studentTime) => {
    if (!Array.isArray(tutorSlots) || !studentTime) return false;
    
    const normalizedTime = normalizeString(studentTime);
    
    // Define time keywords for flexible matching
    const timeKeywords = {
        morning: ['morning', 'am', '8', '9', '10', '11', 'early'],
        afternoon: ['afternoon', 'pm', '12', '1', '2', '3', '4', 'noon'],
        evening: ['evening', 'pm', '5', '6', '7', '8', '9', 'night', 'late']
    };
    
    // Determine which time period the student prefers
    let preferredPeriod = null;
    for (const [period, keywords] of Object.entries(timeKeywords)) {
        if (keywords.some(kw => normalizedTime.includes(kw))) {
            preferredPeriod = period;
            break;
        }
    }
    
    return tutorSlots.some(slot => {
        const normalizedSlot = normalizeString(slot);
        
        // Direct string match
        if (normalizedSlot.includes(normalizedTime) || normalizedTime.includes(normalizedSlot)) {
            return true;
        }
        
        // Period-based matching
        if (preferredPeriod && timeKeywords[preferredPeriod]) {
            return timeKeywords[preferredPeriod].some(kw => normalizedSlot.includes(kw));
        }
        
        return false;
    });
};

/**
 * Calculates normalized rating score (0-1) based on tutor's rating and experience
 * Combines rating with experience bonus for comprehensive quality score
 * @param {Object} tutor - Tutor document from database
 * @returns {number} - Normalized score between 0 and 1
 */
const calculateRatingScore = (tutor) => {
    // Normalize rating from 0-5 scale to 0-1
    const ratingScore = (tutor.rating || 0) / 5;
    
    // Calculate experience bonus (caps at 10 years for max bonus)
    const experienceBonus = Math.min((tutor.yearsOfExperience || 0) / 10, 1) * 0.2;
    
    // Calculate sessions bonus (caps at 100 sessions for max bonus)
    const sessionsBonus = Math.min((tutor.totalSessionsCompleted || 0) / 100, 1) * 0.1;
    
    // Weight: 70% rating, 20% experience, 10% session count
    const combinedScore = (ratingScore * 0.7) + experienceBonus + sessionsBonus;
    
    // Ensure score is between 0 and 1
    return Math.min(Math.max(combinedScore, 0), 1);
};

/**
 * MAIN MATCHING FUNCTION: Constraint-Based Weighted Tutor Matching
 * 
 * This function implements a two-phase matching algorithm:
 * Phase 1 (Hard Constraints): Filter out tutors who don't meet mandatory requirements
 * Phase 2 (Weighted Scoring): Calculate scores for remaining tutors based on multiple factors
 * 
 * Architecture designed for easy extension to ML-based ranking:
 * - Feature extraction is modular (each match check returns boolean)
 * - Weights are configurable and can be replaced by learned weights
 * - Score calculation is separated from filtering logic
 * 
 * @param {Array<Object>} tutors - Array of tutor documents
 * @param {Object} studentPreferences - Student's matching preferences
 * @returns {Array<Object>} - Ranked array of matching tutors with scores
 */
const calculateMatchScores = (tutors, studentPreferences) => {
    const { learningTopic, preferredLanguage, timeOfDay } = studentPreferences;
    const { weights } = MATCHING_CONFIG;
    
    const scoredTutors = [];
    
    for (const tutor of tutors) {
        // ====================================================================
        // PHASE 1: HARD CONSTRAINTS (Filter Step)
        // Tutors MUST meet these requirements to be considered
        // ====================================================================
        
        // Hard Constraint 1: Must be verified
        if (!tutor.isVerified) {
            continue; // Skip unverified tutors
        }
        
        // Hard Constraint 2: Must teach the requested subject
        const topicMatch = checkTopicMatch(tutor.subjectDomains, learningTopic);
        if (!topicMatch) {
            continue; // Skip tutors who don't teach this subject
        }
        
        // Hard Constraint 3: Must be available at requested time
        const timeMatch = checkTimeMatch(tutor.availableSlots, timeOfDay);
        if (!timeMatch) {
            continue; // Skip tutors not available at this time
        }
        
        // ====================================================================
        // PHASE 2: WEIGHTED SCORING (Ranking Step)
        // Calculate comprehensive score for tutors who passed hard constraints
        // ====================================================================
        
        // Feature extraction (all features as 0 or 1 for easy ML extension)
        const features = {
            topic: topicMatch ? 1 : 0,      // Already passed hard constraint, so always 1
            language: checkLanguageMatch(tutor.teachingLanguages, preferredLanguage) ? 1 : 0,
            time: timeMatch ? 1 : 0,         // Already passed hard constraint, so always 1
            rating: calculateRatingScore(tutor)  // Normalized 0-1 score
        };
        
        // Calculate weighted final score
        // FinalScore = Σ (weight_i × feature_i)
        const finalScore = 
            (weights.topic * features.topic) +
            (weights.language * features.language) +
            (weights.time * features.time) +
            (weights.rating * features.rating);
        
        // Store match details for transparency and debugging
        const matchDetails = {
            topic: features.topic === 1,
            language: features.language === 1,
            time: features.time === 1,
            ratingScore: features.rating,
            weights: { ...weights }  // Include weights used for this calculation
        };
        
        // Create scored tutor object
        scoredTutors.push({
            _id: tutor._id,
            name: tutor.name,
            email: tutor.email,
            subjectDomains: tutor.subjectDomains,
            teachingLanguages: tutor.teachingLanguages,
            availableSlots: tutor.availableSlots,
            rating: tutor.rating || 0,
            yearsOfExperience: tutor.yearsOfExperience || 0,
            totalSessionsCompleted: tutor.totalSessionsCompleted || 0,
            // Scoring information
            score: Math.round(finalScore * 100),  // Convert to 0-100 scale for display
            normalizedScore: finalScore,           // Keep 0-1 scale for internal use
            matchDetails,
            features  // Include raw features for potential ML training data
        });
    }
    
    // Sort by final score (descending)
    scoredTutors.sort((a, b) => b.normalizedScore - a.normalizedScore);
    
    return scoredTutors;
};

// ============================================================================
// API ROUTES
// ============================================================================

// POST /api/tutors/signup - Handles data submission from the Tutor Portal
router.post('/signup', async (req, res) => {
    try {
        const { email, name, password, subjectDomains, teachingLanguages, availableSlots } = req.body;
        
        // Check if tutor already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ 
                message: 'An account with this email already exists. Please sign in.',
                exists: true
            });
        }
        
        // Parse comma-separated strings into arrays
        const parseList = (str) => {
            if (Array.isArray(str)) return str.map(s => s.trim());
            if (typeof str === 'string') return str.split(',').map(s => s.trim());
            return [];
        };
        
        // Create new teacher profile
        const newTeacher = await Teacher.create({
            email,
            name,
            password, 
            subjectDomains: parseList(subjectDomains),
            teachingLanguages: parseList(teachingLanguages),
            availableSlots: parseList(availableSlots),
            isVerified: true,  // Auto-verify for testing (change to false in production)
            rating: 0,
            totalRatings: 0,
            yearsOfExperience: 0,
            totalSessionsCompleted: 0
        });

        res.status(201).json({ 
            message: 'Tutor profile created successfully. Awaiting verification.', 
            teacherId: newTeacher._id,
            name: newTeacher.name,
            email: newTeacher.email
        });

    } catch (error) {
        console.error('Error during tutor signup:', error);
        res.status(400).json({ message: 'Signup failed. Email may be in use.', error: error.message });
    }
});

// POST /api/tutors/signin - Handles tutor sign-in
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find tutor by email
        const tutor = await Teacher.findOne({ email });
        
        if (!tutor) {
            return res.status(404).json({ 
                message: 'No account found with this email. Please sign up first.',
                exists: false
            });
        }
        
        // Check password (simple comparison - in production use bcrypt)
        if (tutor.password !== password) {
            return res.status(401).json({ 
                message: 'Incorrect password. Please try again.'
            });
        }
        
        res.status(200).json({ 
            message: 'Sign in successful!', 
            teacherId: tutor._id,
            email: tutor.email,
            name: tutor.name,
            isVerified: tutor.isVerified,
            tutor: {
                _id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                isVerified: tutor.isVerified,
                subjectDomains: tutor.subjectDomains,
                teachingLanguages: tutor.teachingLanguages,
                availableSlots: tutor.availableSlots,
                rating: tutor.rating,
                totalSessionsCompleted: tutor.totalSessionsCompleted
            }
        });

    } catch (error) {
        console.error('Error during tutor signin:', error);
        res.status(500).json({ message: 'Sign in failed.', error: error.message });
    }
});

/**
 * GET /api/tutors/match - CORE TUTOR MATCHING ENGINE
 * 
 * Implements Constraint-Based Weighted Matching Algorithm
 * 
 * Query Parameters:
 * - learningTopic: Subject the student wants to learn
 * - preferredLanguage: Language of instruction preference
 * - timeOfDay: Preferred time for classes
 * 
 * Returns: Top N tutors sorted by match score
 */
router.get('/match', async (req, res) => {
    try {
        const { learningTopic, preferredLanguage, timeOfDay } = req.query;

        // ====================================================================
        // INPUT VALIDATION
        // ====================================================================
        if (!learningTopic || !preferredLanguage || !timeOfDay) {
            console.warn('Match Failed: Missing required query parameters');
            return res.status(400).json({ 
                message: 'Missing required matching criteria.',
                required: ['learningTopic', 'preferredLanguage', 'timeOfDay'],
                received: { learningTopic, preferredLanguage, timeOfDay }
            });
        }
        
        // ====================================================================
        // FETCH CANDIDATES
        // Only fetch verified tutors (pre-filter at database level for efficiency)
        // ====================================================================
        const tutors = await Teacher.find({ isVerified: true });
        
        if (tutors.length === 0) {
            return res.status(200).json({
                message: 'No verified tutors available at this time.',
                tutors: [],
                matchStats: { totalCandidates: 0, matchedCount: 0 }
            });
        }
        
        // ====================================================================
        // EXECUTE MATCHING ALGORITHM
        // ====================================================================
        const studentPreferences = { learningTopic, preferredLanguage, timeOfDay };
        const rankedTutors = calculateMatchScores(tutors, studentPreferences);
        
        // Filter by minimum score threshold
        const qualifiedTutors = rankedTutors.filter(
            t => t.normalizedScore >= MATCHING_CONFIG.minScoreThreshold
        );
        
        // Get top N results
        const topMatches = qualifiedTutors.slice(0, MATCHING_CONFIG.maxResults);
        
        // ====================================================================
        // PREPARE RESPONSE
        // ====================================================================
        console.log(`Match Results: ${topMatches.length}/${tutors.length} tutors matched for topic="${learningTopic}"`);
        
        res.status(200).json(topMatches);

    } catch (error) {
        console.error('Error during tutor matching:', error);
        res.status(500).json({ 
            message: 'Matching engine failed due to a server error.', 
            error: error.message 
        });
    }
});

/**
 * GET /api/tutors/all - Get all tutors (for admin dashboard)
 */
router.get('/all', async (req, res) => {
    try {
        const tutors = await Teacher.find().select('-password');
        res.status(200).json(tutors);
    } catch (error) {
        console.error('Error fetching tutors:', error);
        res.status(500).json({ message: 'Failed to fetch tutors.', error: error.message });
    }
});

/**
 * PATCH /api/tutors/verify-all - Verify ALL tutors (for testing/admin)
 */
router.patch('/verify-all', async (req, res) => {
    try {
        const result = await Teacher.updateMany(
            { isVerified: false },
            { $set: { isVerified: true } }
        );
        
        res.status(200).json({ 
            message: `${result.modifiedCount} tutors verified successfully.`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error verifying all tutors:', error);
        res.status(500).json({ message: 'Verification failed.', error: error.message });
    }
});

/**
 * PATCH /api/tutors/:id/verify - Verify a tutor (admin only)
 */
router.patch('/:id/verify', async (req, res) => {
    try {
        const tutor = await Teacher.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );
        
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found.' });
        }
        
        res.status(200).json({ message: 'Tutor verified successfully.', tutor });
    } catch (error) {
        console.error('Error verifying tutor:', error);
        res.status(500).json({ message: 'Verification failed.', error: error.message });
    }
});

/**
 * POST /api/tutors/rate - Rate a tutor after session
 */
router.post('/rate', async (req, res) => {
    try {
        const { tutorId, rating } = req.body;
        
        if (!tutorId || rating === undefined || rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating. Must be between 0 and 5.' });
        }
        
        const tutor = await Teacher.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found.' });
        }
        
        // Calculate new average rating
        const totalRatings = tutor.totalRatings + 1;
        const newRating = ((tutor.rating * tutor.totalRatings) + rating) / totalRatings;
        
        await Teacher.findByIdAndUpdate(tutorId, {
            rating: Math.round(newRating * 10) / 10,  // Round to 1 decimal
            totalRatings: totalRatings
        });
        
        res.status(200).json({ message: 'Rating submitted successfully.', newRating });
    } catch (error) {
        console.error('Error rating tutor:', error);
        res.status(500).json({ message: 'Rating failed.', error: error.message });
    }
});

/**
 * POST /api/tutors/assign - Assign a tutor to a student
 */
router.post('/assign', async (req, res) => {
    try {
        const { studentId, tutorId } = req.body;
        
        if (!studentId || !tutorId) {
            return res.status(400).json({ message: 'Both studentId and tutorId are required.' });
        }
        
        // Update student's profile with assigned tutor
        await Student.findByIdAndUpdate(studentId, { currentTutor: tutorId });
        
        // Add student to tutor's assigned list
        await Teacher.findByIdAndUpdate(tutorId, { 
            $addToSet: { assignedStudents: studentId } 
        });

        res.status(200).json({ message: 'Tutor assigned successfully.' });
    } catch (error) {
        console.error('Error during tutor assignment:', error);
        res.status(500).json({ message: 'Assignment failed.', error: error.message });
    }
});

/**
 * POST /api/tutors/session-complete - Mark a session as completed
 */
router.post('/session-complete', async (req, res) => {
    try {
        const { tutorId } = req.body;
        
        await Teacher.findByIdAndUpdate(tutorId, {
            $inc: { totalSessionsCompleted: 1 }
        });
        
        res.status(200).json({ message: 'Session marked as complete.' });
    } catch (error) {
        console.error('Error completing session:', error);
        res.status(500).json({ message: 'Failed to complete session.', error: error.message });
    }
});

module.exports = router;