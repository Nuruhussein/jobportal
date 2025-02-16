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

// Submit a new application        yes
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { jobId, cvLink, coverLetter } = req.body;

        if (!req.user || req.user.role !== 'job_seeker') {
            return res.status(403).json({ error: 'Only job seekers can submit applications.' });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        if (job.status === 'closed') {
            return res.status(400).json({ error: 'Applications for this job are closed.' });
        }

        const application = new Application({
            jobId,
            applicantId: req.user.id,
            cvLink,
            coverLetter,
        });

        await application.save();

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

        if (req.user.role !== 'admin' && req.user.role !== 'evaluator') {
            return res.status(403).json({ error: 'Only admins or evaluators can update applications.' });
        }

        if (status) application.status = status;
        if (evaluatorFeedback) application.evaluatorFeedback = evaluatorFeedback;
        if (grade) application.grade = grade;

        await application.save();

        res.json({ message: 'Application updated successfully!', application });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

export default router;
