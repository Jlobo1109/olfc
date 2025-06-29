const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    isSubscribed: {
        type: Boolean,
        default: true
    },
    subscriptionDate: {
        type: Date,
        default: Date.now
    },
    lastEmailSent: {
        type: Date,
        default: null
    },
    preferences: {
        weekly: { type: Boolean, default: true },
        monthly: { type: Boolean, default: true },
        specialEvents: { type: Boolean, default: true }
    }
});

// Index for efficient querying
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isSubscribed: 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema); 