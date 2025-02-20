import jwt from 'jsonwebtoken';

// Authentication Middleware
export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Admin or Employer Role Middleware
export const adminOrEmployerMiddleware = (req, res, next) => {
    const { role } = req.user;
    if (role === 'admin' || role === 'employer' || role === 'faculity') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin or Employer role required.' });
    }
};
