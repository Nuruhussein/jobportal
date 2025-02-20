import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cvLink: { type: String }, // Optional
    cvImage: { type: String , required: true }, // Store the file path or URL of the uploaded CV image
    coverLetter: { type: String }, // Optional
    qualifications: { type: String }, // Optional
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    evaluatorFeedback: { type: String },
    grade: { type: String },
}, { timestamps: true });

// Add a compound index to enforce uniqueness
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;