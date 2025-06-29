const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fatima-church', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const contactRoutes = require('./routes/contact');
const eventsRoutes = require('./routes/events');
const newsletterRoutes = require('./routes/newsletter');
const certificateRoutes = require('./routes/certificates');
const familyBookRoutes = require('./routes/familyBook');

// Use routes
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/family-book', familyBookRoutes);

// Serve the main HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../about.html'));
});

app.get('/parish', (req, res) => {
    res.sendFile(path.join(__dirname, '../parish.html'));
});

app.get('/councils', (req, res) => {
    res.sendFile(path.join(__dirname, '../councils.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../contact.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
}); 