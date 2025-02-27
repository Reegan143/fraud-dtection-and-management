
const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    adminId : {
        type : Number,
        required : true,
        unique : true
    },
    permissions: [{
        type: String,
        enum: ['manage_disputes', 'approve_refunds', 'generate_reports', 'manage_integrations']
    }],
    notification: {
        type : [
            {
                message : {
                    type: String,
                    required: true
                }
            }
        ]
    }
}, {
    timestamps: true
});

const AdminModel = mongoose.model("admin", AdminSchema);
module.exports = AdminModel;