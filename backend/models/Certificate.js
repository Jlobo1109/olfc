const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    requesterName: {
        type: String,
        required: true,
        trim: true
    },
    requesterEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    requesterPhone: {
        type: String,
        required: true,
        trim: true
    },
    certificateType: {
        type: String,
        enum: ['baptism', 'confirmation', 'marriage', 'death', 'first-communion', 'other'],
        required: true
    },
    personName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfEvent: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        trim: true
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true
    },
    requestedDate: {
        type: Date,
        default: Date.now
    },
    processedDate: {
        type: Date,
        default: null
    },
    isUrgent: {
        type: Boolean,
        default: false
    }
});

// Index for efficient querying
certificateSchema.index({ status: 1, requestedDate: -1 });
certificateSchema.index({ requesterEmail: 1 });

module.exports = mongoose.model('Certificate', certificateSchema); 