module.exports = function requireSuperAdmin(req, res, next) {
    if (req.admin?.role !== 'super_admin') {
        return res.status(403).json({ message: 'Super admin access required.' });
    }
    next();
};
