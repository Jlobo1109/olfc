const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email, firstName, lastName, preferences } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if already subscribed
        const existingSubscriber = await Newsletter.findOne({ email });
        
        if (existingSubscriber) {
            if (existingSubscriber.isSubscribed) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already subscribed to our newsletter'
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isSubscribed = true;
                existingSubscriber.firstName = firstName || existingSubscriber.firstName;
                existingSubscriber.lastName = lastName || existingSubscriber.lastName;
                if (preferences) {
                    existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };
                }
                await existingSubscriber.save();

                return res.json({
                    success: true,
                    message: 'Your subscription has been reactivated!'
                });
            }
        }

        // Create new subscription
        const newsletter = new Newsletter({
            email,
            firstName,
            lastName,
            preferences: preferences || {
                weekly: true,
                monthly: true,
                specialEvents: true
            }
        });

        await newsletter.save();

        // Send welcome email
        const welcomeMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Lady of Fatima Church Newsletter',
            html: `
                <h2>Welcome to Our Newsletter!</h2>
                <p>Dear ${firstName || 'Parishioner'},</p>
                <p>Thank you for subscribing to our newsletter. You will now receive updates about:</p>
                <ul>
                    <li>Weekly mass schedules and events</li>
                    <li>Monthly parish activities</li>
                    <li>Special celebrations and announcements</li>
                    <li>Community news and updates</li>
                </ul>
                <p>May God bless you and your family!</p>
                <p>Best regards,<br>Our Lady of Fatima Church Team</p>
            `
        };

        await transporter.sendMail(welcomeMailOptions);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to our newsletter!'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.'
        });
    }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const subscriber = await Newsletter.findOne({ email });

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in our subscription list'
            });
        }

        subscriber.isSubscribed = false;
        await subscriber.save();

        res.json({
            success: true,
            message: 'You have been unsubscribed from our newsletter'
        });

    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe. Please try again.'
        });
    }
});

module.exports = router; 