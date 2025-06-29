const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all active events
router.get('/', async (req, res) => {
    try {
        const { category, limit = 20, upcoming = true } = req.query;
        
        let query = { isActive: true };
        
        if (category) {
            query.category = category;
        }
        
        if (upcoming === 'true') {
            query.date = { $gte: new Date() };
        }
        
        const events = await Event.find(query)
            .sort({ date: 1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events'
        });
    }
});

// Get upcoming events for homepage
router.get('/upcoming', async (req, res) => {
    try {
        const events = await Event.find({
            isActive: true,
            date: { $gte: new Date() }
        })
        .sort({ date: 1 })
        .limit(5);

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming events'
        });
    }
});

// Get mass schedule
router.get('/mass-schedule', async (req, res) => {
    try {
        const massEvents = await Event.find({
            isActive: true,
            category: 'mass',
            date: { $gte: new Date() }
        })
        .sort({ date: 1, time: 1 })
        .limit(10);

        res.json({
            success: true,
            data: massEvents
        });
    } catch (error) {
        console.error('Get mass schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mass schedule'
        });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            category,
            image,
            isRecurring,
            recurringPattern
        } = req.body;

        // Validate required fields
        if (!title || !description || !date || !time || !location || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        const event = new Event({
            title,
            description,
            date: new Date(date),
            time,
            location,
            category,
            image,
            isRecurring,
            recurringPattern
        });

        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event'
        });
    }
});

// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event'
        });
    }
});

// Update event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event'
        });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event'
        });
    }
});

// Toggle event active status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        event.isActive = !event.isActive;
        await event.save();

        res.json({
            success: true,
            message: `Event ${event.isActive ? 'activated' : 'deactivated'} successfully`,
            data: event
        });
    } catch (error) {
        console.error('Toggle event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle event status'
        });
    }
});

module.exports = router; 