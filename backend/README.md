# Our Lady of Fatima Church - Backend API

This is the backend API for the Our Lady of Fatima Church website, built with Node.js, Express, and MongoDB.

## Features

- **Contact Management**: Handle contact form submissions with email notifications
- **Event Management**: Manage church events, mass schedules, and activities
- **Newsletter System**: Subscribe/unsubscribe functionality with email preferences
- **Certificate Requests**: Handle certificate requests with status tracking
- **Family Book**: Manage parishioner family information and updates
- **Email Notifications**: Automated email responses for all interactions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email notifications

## Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fatima-church
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   ```

4. **Set up Gmail for email notifications:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password
   - Use the App Password in EMAIL_PASS

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Contact Management
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/all` - Get all contact submissions (admin)
- `GET /api/contact/:id` - Get specific contact submission
- `PATCH /api/contact/:id/status` - Update contact status

### Event Management
- `GET /api/events` - Get all active events
- `GET /api/events/upcoming` - Get upcoming events for homepage
- `GET /api/events/mass-schedule` - Get mass schedule
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PATCH /api/events/:id/toggle` - Toggle event active status

### Newsletter Management
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `PATCH /api/newsletter/preferences` - Update subscription preferences

### Certificate Requests
- `POST /api/certificates/request` - Submit certificate request
- `GET /api/certificates/all` - Get all certificate requests (admin)
- `GET /api/certificates/:id` - Get specific certificate request
- `PATCH /api/certificates/:id/status` - Update certificate status
- `GET /api/certificates/stats/overview` - Get certificate statistics

### Family Book Management
- `POST /api/family-book/update` - Submit family book update
- `GET /api/family-book/all` - Get all family records (admin)
- `GET /api/family-book/search` - Search family records
- `GET /api/family-book/:id` - Get specific family record
- `PATCH /api/family-book/:id/status` - Update family status
- `GET /api/family-book/stats/overview` - Get family statistics
- `GET /api/family-book/export/data` - Export family data (admin)

## Database Models

### Contact
- name, email, phone, subject, message
- category (general, prayer-request, volunteer, donation, other)
- status (new, read, replied, closed)

### Event
- title, description, date, time, location
- category (mass, celebration, meeting, youth, charity, other)
- isRecurring, recurringPattern, isActive

### Newsletter
- email, firstName, lastName
- isSubscribed, subscriptionDate
- preferences (weekly, monthly, specialEvents)

### Certificate
- requesterName, requesterEmail, requesterPhone
- certificateType (baptism, confirmation, marriage, death, first-communion)
- personName, dateOfEvent, purpose
- status (pending, approved, rejected, completed)

### FamilyBook
- familyName, headOfFamily, spouse, address
- children array with sacramental dates
- emergencyContact, parishActivities
- status (active, inactive, pending-verification)

## Email Notifications

The system automatically sends email notifications for:
- Contact form submissions (confirmation to user, notification to admin)
- Newsletter subscriptions (welcome email)
- Certificate requests (confirmation and status updates)
- Family book updates (confirmation)

## Security Features

- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Email authentication
- Database indexing for performance

## Development

### Project Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
├── .env            # Environment variables
└── README.md       # This file
```

### Adding New Features
1. Create model in `models/` directory
2. Create routes in `routes/` directory
3. Import and use routes in `server.js`
4. Update documentation

## Deployment

### Environment Variables for Production
- Use a production MongoDB instance (MongoDB Atlas recommended)
- Set a strong JWT_SECRET
- Configure production email settings
- Set NODE_ENV=production

### Recommended Hosting
- Heroku
- Vercel
- DigitalOcean
- AWS

## Support

For technical support or questions about the API, please contact the development team.

## License

This project is licensed under the ISC License. 