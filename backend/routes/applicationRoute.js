import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
// Get all applications    yes
router.get('/', authMiddleware, async (req, res) => {
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

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { jobId, cvLink, coverLetter } = req.body;

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
            cvLink,
            coverLetter,
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


// Delete an application
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ error: 'Application not found!' });
        }

        if (req.user.role !== 'admin' && application.applicantId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Only admins or the applicant can delete this application.' });
        }

        await application.remove();

        res.json({ message: 'Application deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/user/status', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id });

        if (applications.length === 0) {
            return res.json({ status: "no_application" }); // No application found
        }

        const application = applications[0]; // Assume there is only one active application per user

        if (application.status === "accepted") {
            return res.json({ status: "accepted" }); // Application accepted
        } else if (application.status === "rejected") {
            return res.json({ status: "rejected" }); // Application rejected
        } else {
            return res.json({ status: "pending" }); // Application still under review (pending)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
