# Our Lady of Fatima Church Website

A modern, responsive website for Our Lady of Fatima Church in Majorda, Goa, built with HTML5, CSS3, JavaScript, and a MERN stack backend.

## 🌟 Features

### Frontend
- **Modern Design**: Beautiful, responsive design with parallax effects
- **Rich Navigation**: Dropdown menus and mobile-friendly hamburger menu
- **Dynamic Content**: Hero sections, event slideshows, and gallery displays
- **Contact Forms**: Interactive forms for inquiries, certificate requests, and family updates
- **Google Maps Integration**: Embedded location map
- **Sidebar Navigation**: Organized sub-pages with left pane navigation

### Backend (MERN Stack)
- **Contact Management**: Handle form submissions with email notifications
- **Event Management**: Church events, mass schedules, and activities
- **Newsletter System**: Subscription management with email preferences
- **Certificate Requests**: Baptism, confirmation, marriage certificates
- **Family Book**: Parishioner family information management
- **Email Automation**: Automated responses for all interactions

## 📁 Project Structure

```
Project/
├── index.html              # Homepage
├── about.html              # About page (redirects to sub-pages)
├── parish.html             # Parish page (redirects to sub-pages)
├── councils.html           # Councils page (redirects to sub-pages)
├── contact.html            # Contact page
├── about/                  # About sub-pages
│   ├── about-history.html
│   ├── about-mass-schedule.html
│   └── sidebar-about.html
├── parish/                 # Parish sub-pages
│   ├── parish-team.html
│   ├── news-notices.html
│   ├── newsletter.html
│   └── sidebar-parish.html
├── councils/               # Councils sub-pages
│   ├── ppc.html
│   ├── scc.html
│   ├── pyc.html
│   ├── altar-servers.html
│   └── sidebar-councils.html
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── script.js          # Main JavaScript
│   └── utils.js           # Utility functions
├── assets/                # Images and media files
├── backend/               # MERN Stack Backend
│   ├── server.js          # Express server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Frontend Setup
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Project
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000`

### Backend Setup
1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fatima-church
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## 🎨 Design Features

### Color Scheme
- **Primary**: Deep Blue (#1e3a8a)
- **Secondary**: Gold (#f59e0b)
- **Accent**: Red (#dc2626)
- **Background**: Light Gray (#f8fafc)
- **Text**: Dark Gray (#1f2937)

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1200px
- Flexible grid system
- Touch-friendly navigation

### Interactive Elements
- Smooth scrolling navigation
- Hover effects and transitions
- Dropdown menus
- Mobile hamburger menu
- Form validation
- Dynamic content loading

## 📱 Pages Overview

### Homepage (`index.html`)
- Hero section with call-to-action buttons
- Upcoming events slideshow
- Gallery slideshow
- Contact form
- Google Maps integration

### About Section
- **History**: Church history and heritage
- **Mass Schedule**: Regular mass timings and special services

### Parish Section
- **Parish Team**: Clergy and staff information
- **News & Notices**: Latest announcements
- **Newsletter**: Subscription management

### Councils Section
- **PPC**: Parish Pastoral Council
- **SCC**: Small Christian Communities
- **PYC**: Parish Youth Council
- **Altar Servers**: Altar server information

### Contact Section
- **Write to Us**: General contact form
- **Request Certificates**: Certificate application forms
- **Update Family Book**: Family information updates

## 🔧 Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: ES6+ with DOM manipulation
- **Font Awesome**: Icons
- **Google Fonts**: Typography

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Nodemailer**: Email functionality
- **CORS**: Cross-origin resource sharing

## 📧 Email Integration

The backend automatically sends emails for:
- Contact form confirmations
- Newsletter subscriptions
- Certificate request updates
- Family book update confirmations

### Email Setup
1. Enable 2-factor authentication on Gmail
2. Generate App Password
3. Configure in `.env` file

## 🗄️ Database Models

### Contact
- Form submissions with categorization
- Status tracking (new, read, replied, closed)

### Event
- Church events and mass schedules
- Recurring event support
- Category-based organization

### Newsletter
- Subscription management
- Email preferences
- Unsubscribe functionality

### Certificate
- Request tracking
- Status management
- Urgent request handling

### FamilyBook
- Family information storage
- Children's sacramental records
- Parish activity tracking

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Database indexing
- Email authentication

## 📊 API Endpoints

### Contact
- `POST /api/contact/submit`
- `GET /api/contact/all`
- `PATCH /api/contact/:id/status`

### Events
- `GET /api/events`
- `GET /api/events/upcoming`
- `POST /api/events`

### Newsletter
- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/unsubscribe`

### Certificates
- `POST /api/certificates/request`
- `GET /api/certificates/all`
- `PATCH /api/certificates/:id/status`

### Family Book
- `POST /api/family-book/update`
- `GET /api/family-book/search`
- `GET /api/family-book/stats/overview`

## 🚀 Deployment

### Frontend
- Deploy to any static hosting service
- Netlify, Vercel, GitHub Pages
- No build process required

### Backend
- Deploy to Node.js hosting platforms
- Heroku, Vercel, DigitalOcean
- Configure environment variables
- Set up MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Contact the development team
- Check the backend README for API documentation
- Review the code comments for implementation details

## 📄 License

This project is licensed under the ISC License.

---

**Our Lady of Fatima Church**  
Majorda, Goa, India  
*Serving the community with faith and technology* #   o l f c  
 