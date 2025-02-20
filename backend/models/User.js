import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/  // Ensures email format
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 4  // Password must be at least 4 characters
    },
    role: { 
        type: String, 
        enum: ['job_seeker', 'employer', 'evaluator', 'faculity', 'admin'], 
        default: "job_seeker" 
    },
    department: { type: String, default: "cs" },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
export default User;
