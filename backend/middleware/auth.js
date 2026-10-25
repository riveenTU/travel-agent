const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin'); // ← uppercase A

module.exports = async function auth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        const token   = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← outside inner try

        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Admin not found or deactivated.' });
        }

        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};