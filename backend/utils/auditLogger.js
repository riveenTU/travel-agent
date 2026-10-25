const AuditLog = require('../models/AuditLog');

async function logAction(admin, action, targetName, targetId = null, note = '') {
    try {
        await AuditLog.create({
            adminId:    admin._id,
            adminName:  admin.name,
            action,
            targetId:   targetId?.toString(),
            targetName,
            note,
        });
    } catch (err) {
        console.error('Audit log error:', err.message);
    }
}

module.exports = logAction;