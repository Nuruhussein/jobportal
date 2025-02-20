import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    qualifications: { type: String },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    postStatus: { type: String, enum: ['published', 'draft'], default: 'draft' }, // Add this field
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', JobSchema);
export default Job;