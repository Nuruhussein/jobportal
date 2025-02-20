import express from 'express';
import Job from '../models/Job.js';
import { authMiddleware, adminOrEmployerMiddleware } from '../middleware/auth.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
// import { authMiddleware, adminOrEmployerMiddleware } from '../middleware/auth.js';
const router = express.Router();

// Create a new job           yes
router.post('/', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        const { title, description, qualifications, deadline,department } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: User not found in request.' });
        }

        let user = await User.findById(req.user.id); 

        // if(!department ){
        //    let department = user.department; 
        // }
        const jobDepartment = department || user.department;
   

        const job = new Job({
            title,
            description,
            department: jobDepartment,
            qualifications,
            deadline,
            postedBy: req.user.id,
        });

        await job.save();
        res.status(201).json({ message: 'Job created successfully!', job });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const { search, department } = req.query;

        let query = {
            status: "open",
            postStatus: "published",
        };

        if (department) {
            query.department = department;
        }

        if (search) {
            query.title = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        const jobs = await Job.find(query)
        .populate('postedBy', 'name email') // Populate the postedBy field
        .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        let jobs;

        if (user.role === "faculity") {
            jobs = await Job.find({ department: user.department }).populate('postedBy', 'name email');
            console.log(jobs);
        } else {
            jobs = await Job.find().populate('postedBy', 'name email');
        }

        res.json(jobs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Retrieve a single job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        res.json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a job           yes
router.patch('/:id', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: User not found in request.' });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        // if (job.postedBy.toString() !== req.user.id) {
        //     return res.status(403).json({ error: 'Forbidden: You are not authorized to update this job.' });
        // }

        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Job updated successfully!', job: updatedJob });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// yes
router.delete('/:id', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: User not found in request.' });
        }

        // Fetch job and populate 'postedBy'
        const job = await Job.findById(id).populate('postedBy', '_id name');

        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        // // Check if the job has a valid 'postedBy' field
        // if (!job.postedBy || job.postedBy._id.toString() !== req.user.id) {
        //     return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this job.' });
        // }

        // Delete the job using deleteOne
        await job.deleteOne();

        res.json({ message: 'Job deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Retrieve applicants for a specific job
router.get('/:id/applicants', authMiddleware, adminOrEmployerMiddleware, async (req, res) => {
    try {
        const { id: jobId } = req.params;

        // Ensure job exists and populate the postedBy field
        const job = await Job.findById(jobId).populate('postedBy', '_id name email');
        if (!job) {
            return res.status(404).json({ error: 'Job not found!' });
        }

        // Check if the job has a valid postedBy field
        if (!job.postedBy) {
            return res.status(400).json({ error: 'Job does not have a valid owner.' });
        }

        // Check if the requester is authorized (admin or employer who posted the job)
        if (job.postedBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to view applicants for this job.' });
        }

        // Find applications for the job and populate applicant details
        const applications = await Application.find({ jobId })
            .populate('applicantId', 'name email department')
            .select('cvLink coverLetter status createdAt');

        res.json({ message: 'Applicants retrieved successfully!', applicants: applications });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


export default router;
