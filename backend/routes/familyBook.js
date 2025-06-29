const express = require('express');
const router = express.Router();
const FamilyBook = require('../models/FamilyBook');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Submit family book update
router.post('/update', async (req, res) => {
    try {
        const {
            familyName,
            headOfFamily,
            spouse,
            address,
            children,
            emergencyContact,
            parishActivities,
            notes
        } = req.body;

        // Validate required fields
        if (!familyName || !headOfFamily || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Check if family already exists
        let familyBook = await FamilyBook.findOne({ familyName });

        if (familyBook) {
            // Update existing family
            familyBook.headOfFamily = { ...familyBook.headOfFamily, ...headOfFamily };
            if (spouse) familyBook.spouse = { ...familyBook.spouse, ...spouse };
            familyBook.address = { ...familyBook.address, ...address };
            if (children) familyBook.children = children;
            if (emergencyContact) familyBook.emergencyContact = emergencyContact;
            if (parishActivities) familyBook.parishActivities = parishActivities;
            if (notes) familyBook.notes = notes;
            familyBook.updatedBy = headOfFamily.name;
        } else {
            // Create new family entry
            familyBook = new FamilyBook({
                familyName,
                headOfFamily,
                spouse,
                address,
                children: children || [],
                emergencyContact,
                parishActivities: parishActivities || [],
                notes,
                updatedBy: headOfFamily.name
            });
        }

        await familyBook.save();

        // Send confirmation email
        const confirmationMailOptions = {
            from: process.env.EMAIL_USER,
            to: headOfFamily.email,
            subject: 'Family Book Update Confirmation - Our Lady of Fatima Church',
            html: `
                <h2>Family Book Update Confirmation</h2>
                <p>Dear ${headOfFamily.name},</p>
                <p>Thank you for updating your family information in our parish records.</p>
                <p><strong>Family Name:</strong> ${familyName}</p>
                <p><strong>Updated By:</strong> ${headOfFamily.name}</p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
                <p>Your information has been recorded and will be reviewed by our parish team.</p>
                <p>Best regards,<br>Our Lady of Fatima Church Team</p>
            `
        };

        await transporter.sendMail(confirmationMailOptions);

        res.status(201).json({
            success: true,
            message: 'Family book updated successfully!'
        });

    } catch (error) {
        console.error('Family book update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update family book. Please try again.'
        });
    }
});

// Get all family records (admin only)
router.get('/all', async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        }

        const families = await FamilyBook.find(query)
            .sort({ lastUpdated: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: families
        });
    } catch (error) {
        console.error('Get families error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch family records'
        });
    }
});

// Search families
router.get('/search', async (req, res) => {
    try {
        const { query, limit = 20 } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const families = await FamilyBook.find({
            $or: [
                { familyName: { $regex: query, $options: 'i' } },
                { 'headOfFamily.name': { $regex: query, $options: 'i' } },
                { 'spouse.name': { $regex: query, $options: 'i' } },
                { 'children.name': { $regex: query, $options: 'i' } }
            ]
        })
        .sort({ lastUpdated: -1 })
        .limit(parseInt(limit));

        res.json({
            success: true,
            data: families
        });
    } catch (error) {
        console.error('Search families error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search family records'
        });
    }
});

// Get family by ID
router.get('/:id', async (req, res) => {
    try {
        const family = await FamilyBook.findById(req.params.id);
        
        if (!family) {
            return res.status(404).json({
                success: false,
                message: 'Family record not found'
            });
        }

        res.json({
            success: true,
            data: family
        });
    } catch (error) {
        console.error('Get family error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch family record'
        });
    }
});

// Update family status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const family = await FamilyBook.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                notes: notes || family.notes,
                updatedBy: 'Admin'
            },
            { new: true }
        );

        if (!family) {
            return res.status(404).json({
                success: false,
                message: 'Family record not found'
            });
        }

        res.json({
            success: true,
            message: 'Family status updated successfully',
            data: family
        });
    } catch (error) {
        console.error('Update family error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update family status'
        });
    }
});

// Get family statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const totalFamilies = await FamilyBook.countDocuments();
        const activeFamilies = await FamilyBook.countDocuments({ status: 'active' });
        const pendingVerification = await FamilyBook.countDocuments({ status: 'pending-verification' });
        const inactiveFamilies = await FamilyBook.countDocuments({ status: 'inactive' });

        // Get families by city
        const cityStats = await FamilyBook.aggregate([
            {
                $group: {
                    _id: '$address.city',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get recent updates
        const recentUpdates = await FamilyBook.find()
            .sort({ lastUpdated: -1 })
            .limit(5)
            .select('familyName headOfFamily.name lastUpdated');

        res.json({
            success: true,
            data: {
                total: totalFamilies,
                active: activeFamilies,
                pendingVerification: pendingVerification,
                inactive: inactiveFamilies,
                byCity: cityStats,
                recentUpdates: recentUpdates
            }
        });
    } catch (error) {
        console.error('Get family stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch family statistics'
        });
    }
});

// Export family data (admin only)
router.get('/export/data', async (req, res) => {
    try {
        const families = await FamilyBook.find({ status: 'active' })
            .select('-__v')
            .sort({ familyName: 1 });

        res.json({
            success: true,
            data: families,
            exportDate: new Date().toISOString()
        });
    } catch (error) {
        console.error('Export family data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export family data'
        });
    }
});

module.exports = router; 