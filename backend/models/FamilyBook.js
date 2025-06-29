const mongoose = require('mongoose');

const familyBookSchema = new mongoose.Schema({
    familyName: {
        type: String,
        required: true,
        trim: true
    },
    headOfFamily: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        dateOfBirth: { type: Date },
        baptismDate: { type: Date },
        confirmationDate: { type: Date }
    },
    spouse: {
        name: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },
        dateOfBirth: { type: Date },
        baptismDate: { type: Date },
        confirmationDate: { type: Date }
    },
    address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, default: 'India' }
    },
    children: [{
        name: { type: String, required: true, trim: true },
        dateOfBirth: { type: Date },
        baptismDate: { type: Date },
        confirmationDate: { type: Date },
        firstCommunionDate: { type: Date },
        isActive: { type: Boolean, default: true }
    }],
    emergencyContact: {
        name: { type: String, trim: true },
        relationship: { type: String, trim: true },
        phone: { type: String, trim: true }
    },
    parishActivities: [{
        activity: { type: String, trim: true },
        role: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        isActive: { type: Boolean, default: true }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending-verification'],
        default: 'active'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
});

// Index for efficient querying
familyBookSchema.index({ familyName: 1 });
familyBookSchema.index({ 'headOfFamily.email': 1 });
familyBookSchema.index({ status: 1 });

// Update the lastUpdated field before saving
familyBookSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('FamilyBook', familyBookSchema); 