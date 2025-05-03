import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['sent', 'failed'],
        required: true,
    },
    reason: {
        type: String,
        enum: ['auth-login', 'delete-budget', 'create-budget', 'create-account', 'other','budget-exceeded','budget-approaching','delete-account'],
        default: null,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    emailData: {
        to: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        html: {
            type: String,
            required: true,
        },
    },
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
