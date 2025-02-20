import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['job_seeker', 'employer', 'evaluator','faculity', 'admin'],default:"job_seeker" },
    department: { type: String, default:"cs" }, // Optional for job seekers or evaluators
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
export default User;
