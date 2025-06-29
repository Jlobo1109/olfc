const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Submit certificate request
router.post('/request', async (req, res) => {
    try {
        const {
            requesterName,
            requesterEmail,
            requesterPhone,
            certificateType,
            personName,
            dateOfEvent,
            purpose,
            additionalInfo,
            isUrgent
        } = req.body;

        // Validate required fields
        if (!requesterName || !requesterEmail || !requesterPhone || !certificateType || !personName || !dateOfEvent || !purpose) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Create new certificate request
        const certificate = new Certificate({
            requesterName,
            requesterEmail,
            requesterPhone,
            certificateType,
            personName,
            dateOfEvent: new Date(dateOfEvent),
            purpose,
            additionalInfo,
            isUrgent: isUrgent || false
        });

        await certificate.save();

        // Send confirmation email to requester
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: requesterEmail,
            subject: 'Certificate Request Received - Our Lady of Fatima Church',
            html: `
                <h2>Certificate Request Received</h2>
                <p>Dear ${requesterName},</p>
                <p>We have received your certificate request and will process it shortly.</p>
                <p><strong>Request Details:</strong></p>
                <ul>
                    <li><strong>Certificate Type:</strong> ${certificateType}</li>
                    <li><strong>Person Name:</strong> ${personName}</li>
                    <li><strong>Date of Event:</strong> ${new Date(dateOfEvent).toLocaleDateString()}</li>
                    <li><strong>Purpose:</strong> ${purpose}</li>
                    <li><strong>Status:</strong> Pending</li>
                </ul>
                <p>We will notify you once your certificate is ready for collection.</p>
                <p>Best regards,<br>Our Lady of Fatima Church Team</p>
            `
        };

        // Send notification email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Certificate Request: ${certificateType} - ${personName}`,
            html: `
                <h2>New Certificate Request</h2>
                <p><strong>Requester:</strong> ${requesterName}</p>
                <p><strong>Email:</strong> ${requesterEmail}</p>
                <p><strong>Phone:</strong> ${requesterPhone}</p>
                <p><strong>Certificate Type:</strong> ${certificateType}</p>
                <p><strong>Person Name:</strong> ${personName}</p>
                <p><strong>Date of Event:</strong> ${new Date(dateOfEvent).toLocaleDateString()}</p>
                <p><strong>Purpose:</strong> ${purpose}</p>
                <p><strong>Additional Info:</strong> ${additionalInfo || 'None'}</p>
                <p><strong>Urgent:</strong> ${isUrgent ? 'Yes' : 'No'}</p>
            `
        };

        // Send emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(201).json({
            success: true,
            message: 'Certificate request submitted successfully!'
        });

    } catch (error) {
        console.error('Certificate request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit certificate request. Please try again.'
        });
    }
});

// Get all certificate requests (admin only)
router.get('/all', async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        }

        const certificates = await Certificate.find(query)
            .sort({ requestedDate: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: certificates
        });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch certificate requests'
        });
    }
});

// Get certificate request by ID
router.get('/:id', async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate request not found'
            });
        }

        res.json({
            success: true,
            data: certificate
        });
    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch certificate request'
        });
    }
});

// Update certificate request status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                adminNotes,
                processedDate: status === 'completed' ? new Date() : null
            },
            { new: true }
        );

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate request not found'
            });
        }

        // Send status update email to requester
        const statusUpdateMailOptions = {
            from: process.env.EMAIL_USER,
            to: certificate.requesterEmail,
            subject: `Certificate Request Update - ${certificate.certificateType}`,
            html: `
                <h2>Certificate Request Status Update</h2>
                <p>Dear ${certificate.requesterName},</p>
                <p>Your certificate request has been updated.</p>
                <p><strong>Certificate Type:</strong> ${certificate.certificateType}</p>
                <p><strong>Person Name:</strong> ${certificate.personName}</p>
                <p><strong>New Status:</strong> ${status}</p>
                ${adminNotes ? `<p><strong>Notes:</strong> ${adminNotes}</p>` : ''}
                ${status === 'completed' ? '<p>Your certificate is ready for collection. Please visit the church office during office hours.</p>' : ''}
                <p>Best regards,<br>Our Lady of Fatima Church Team</p>
            `
        };

        await transporter.sendMail(statusUpdateMailOptions);

        res.json({
            success: true,
            message: 'Certificate request status updated successfully',
            data: certificate
        });
    } catch (error) {
        console.error('Update certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update certificate request'
        });
    }
});

// Get certificate statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const totalRequests = await Certificate.countDocuments();
        const pendingRequests = await Certificate.countDocuments({ status: 'pending' });
        const completedRequests = await Certificate.countDocuments({ status: 'completed' });
        const urgentRequests = await Certificate.countDocuments({ isUrgent: true, status: 'pending' });

        // Get requests by type
        const typeStats = await Certificate.aggregate([
            {
                $group: {
                    _id: '$certificateType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                total: totalRequests,
                pending: pendingRequests,
                completed: completedRequests,
                urgent: urgentRequests,
                byType: typeStats
            }
        });
    } catch (error) {
        console.error('Get certificate stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch certificate statistics'
        });
    }
});

module.exports = router; 