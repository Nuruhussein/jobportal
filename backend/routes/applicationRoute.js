import express from 'express';
import multer from 'multer'; // For handling file uploads
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { authMiddleware,adminOrEmployerMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({ storage });
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Endpoint to download the CV file
router.get('/download-cv/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename); // Construct the full file path

        console.log("File Path:", filePath); // Debugging: Log the file path

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath); // Debugging: Log the error
            return res.status(404).json({ error: 'File not found.' });
        }

        // Stream the file to the client
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Error downloading file:", err); // Debugging: Log the error
                res.status(500).json({ error: 'Failed to download the file.' });
            }
        });
    } catch (error) {
        console.error("Error in download endpoint:", error); // Debugging: Log the error
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Submit a new application with file upload
router.post('/', authMiddleware, upload.single('cvImage'), async (req, res) => {
    try {
        const { jobId, cvLink, coverLetter, qualifications } = req.body;
        const cvImage = req.file ? req.file.path : null; // Get the file path if uploaded

        // Check if the user has already applied for this job
        const existingApplication = await Application.findOne({
            jobId,
            applicantId: req.user.id,
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job.' });
        }

        // Fetch the job to check if it exists and is open
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        if (job.status === 'closed') {
            return res.status(400).json({ error: 'Applications for this job are closed.' });
        }

        // Create a new application
        const application = new Application({
            jobId,
            applicantId: req.user.id,
            cvLink: cvLink || null,
            cvImage, // Save the file path
            coverLetter: coverLetter || null,
            qualifications: qualifications || null,
        });

        await application.save();

        // Add the application to the job's applicants list
        job.applicants.push(application._id);
        await job.save();

        res.status(201).json({ message: 'Application submitted successfully!', application });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Get all applications    yes
router.get('/', authMiddleware,adminOrEmployerMiddleware, async (req, res) => {




    
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'evaluator') {
            return res.status(403).json({ error: 'Access denied. Only admins or evaluators can view all applications.' });
        }

        const applications = await Application.find()
            .populate('jobId', 'title status')
            .populate('applicantId', 'name email');

        res.json(applications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// router.post('/', authMiddleware, async (req, res) => {
//     try {
//         const { jobId, cvLink, coverLetter } = req.body;

//         // Check if the user has already applied for this job
//         const existingApplication = await Application.findOne({
//             jobId,
//             applicantId: req.user.id,
//         });

//         if (existingApplication) {
//             return res.status(400).json({ error: 'You have already applied for this job.' });
//         }

//         // Fetch the job to check if it exists and is open
//         const job = await Job.findById(jobId);

//         if (!job) {
//             return res.status(404).json({ error: 'Job not found!' });
//         }

//         if (job.status === 'closed') {
//             return res.status(400).json({ error: 'Applications for this job are closed.' });
//         }

//         // Create a new application
//         const application = new Application({
//             jobId,
//             applicantId: req.user.id,
//             cvLink,
//             coverLetter,
//         });

//         await application.save();

//         // Add the application to the job's applicants list
//         job.applicants.push(application._id);
//         await job.save();

//         res.status(201).json({ message: 'Application submitted successfully!', application });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });
router.get("/user",  authMiddleware , async (req, res) => {
    const applications = await Application.find({ userId: req.user.id });
    res.json(applications);
  });
  
// Get all applications for a job     yes
router.get('/job/:jobId', authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'evaluator' && job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. Only admins, evaluators, or the job poster can view applications.' });
        }

        const applications = await Application.find({ jobId }).populate('applicantId', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a specific application
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('applicantId', 'name email');

        if (!application) {
            return res.status(404).json({ error: 'Application not found!' });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'evaluator' && application.applicantId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. Only admins, evaluators, or the applicant can view this application.' });
        }

        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update application status and feedback
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, evaluatorFeedback, grade } = req.body;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ error: 'Application not found!' });
        }

        // Check user role
        if (req.user.role !== 'admin' && req.user.role !== 'evaluator') {
            return res.status(403).json({ error: 'Only admins or evaluators can update applications.' });
        }

        // Update fields if provided
        if (status) application.status = status;
        if (evaluatorFeedback) application.evaluatorFeedback = evaluatorFeedback;
        if (grade) application.grade = grade;

        await application.save();

        res.json({ message: 'Application updated successfully!', application });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to update the application status.' });
    }
});


router.delete('/:id', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting application with ID:", id);
        console.log("User making the request:", req.user);

        const application = await Application.findByIdAndDelete(id);

        if (!application) {
            return res.status(404).json({ error: 'Application not found!' });
        }

        res.json({ message: 'Application deleted successfully!' });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(400).json({ error: error.message });
    }
});
router.get('/user/status', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id }).populate('jobId');

        if (applications.length === 0) {
            return res.json({ status: "no_application" }); // No application found
        }

        const application = applications[0]; // Assume there is only one active application per user

        // Include job details in the response
        const response = {
            status: application.status,
            jobTitle: application.jobId.title, // Assuming the job title is stored in the job document
            jobId: application.jobId._id, // Include job ID if needed
        };

        return res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
