import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cvLink: { type: String, required: true },
    coverLetter: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    evaluatorFeedback: { type: String },
    grade: { type: String },
}, { timestamps: true });

// Add a compound index to enforce uniqueness
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;