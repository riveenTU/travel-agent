const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    adminName:  String,
    action:     {
        type: String,
        enum: ['created', 'updated', 'deleted', 'published', 'drafted', 'duplicated', 'login'],
        required: true
    },
    targetId:   String,
    targetName: String,
    note:       String,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
