import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cvLink: { type: String, required: true },
    coverLetter: { type: String },
    status: { type: String, enum: ['submitted', 'shortlisted', 'rejected'], default: 'submitted' },
    evaluatorFeedback: { type: String },
    grade: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
