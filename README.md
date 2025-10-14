# OLFC Website with Firebase CMS

A modern church website with a comprehensive Content Management System built with Firebase.

## 🚀 Quick Setup

### Prerequisites
- Firebase project (`olfatimachurch-b8123`)
- Node.js installed
- Firebase CLI installed

### 1. Deploy Cloud Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### 2. Install Script Dependencies
```bash
cd scripts
npm install
```

### 3. Create Admin User
```bash
node create-admin.js
```
**Admin Credentials:** `admin@olfcmajiwada.com` / `OLFC@Admin2024!`

### 4. Auto-populate Content
```bash
node migrate-content.js
```

### 5. Deploy Website
```bash
firebase deploy --only hosting
```

### 6. Access CMS
- **Website**: `https://olfcmajiwada.com`
- **CMS**: `https://admin.olfcmajiwada.com/cms/`

## 📁 Project Structure

```
olfc/
├── cms/                    # CMS Dashboard
│   ├── index.html         # Main dashboard
│   ├── login.html         # Admin login
│   └── css/cms.css        # CMS styles
├── functions/             # Firebase Cloud Functions
│   ├── index.js          # API endpoints
│   └── package.json      # Dependencies
├── scripts/               # Setup scripts
│   ├── migrate-content.js # Auto-populate content
│   ├── create-admin.js    # Create admin user
│   └── package.json       # Script dependencies
├── css/style.css          # Main website styles
├── script/                # Frontend JavaScript
│   ├── home_content.js    # Homepage content
│   ├── parish_content.js  # Parish content
│   └── about_content.js   # About content
└── images/                # Website images
```

## 🔧 Configuration

### Firebase Config
Update Firebase configuration in:
- `cms/index.html` (line 264-272)
- `cms/login.html` (line 204-212)

### Custom Domain
- Main site: `olfcmajiwada.com`
- CMS: `admin.olfcmajiwada.com`

## 📊 Content Management

### Auto-populated Content
- ✅ Hero section (homepage banner)
- ✅ Welcome message
- ✅ About & church history
- ✅ Mass schedule
- ✅ Parish team members
- ✅ Events and articles
- ✅ Site settings

### CMS Features
- 📝 Edit all website content
- 🖼️ Upload and manage images
- 👥 Manage parish team
- 📅 Add/edit events
- 🏘️ Manage communities
- ⚙️ Update site settings

## 🔐 Security

- **Authentication**: Firebase Auth with admin roles
- **Access Control**: Only admin users can edit content
- **Data Protection**: All content publicly readable, admin-only editing
- **Secure Login**: Email/password authentication

## 🛠️ Development

### Local Development
```bash
# Start Firebase emulators
firebase emulators:start

# Run migration locally
cd scripts
node migrate-content.js
```

### Adding New Content Types
1. Update Firestore schema in `scripts/migrate-content.js`
2. Add CMS interface in `cms/index.html`
3. Update Cloud Functions in `functions/index.js`

## 📱 Features

### Website
- Responsive design
- Dynamic content loading
- Image optimization
- SEO-friendly structure

### CMS Dashboard
- Modern admin interface
- Real-time content editing
- Image upload management
- User-friendly forms

## 🆘 Troubleshooting

### Common Issues
1. **CMS won't load**: Check Firebase config and Cloud Functions deployment
2. **Content not showing**: Run migration script and check Firestore
3. **Login fails**: Verify admin user creation and credentials
4. **Images not loading**: Check Firebase Storage rules and image URLs

### Debug Steps
1. Check Firebase Console for errors
2. Verify all setup steps completed
3. Check browser console for JavaScript errors
4. Ensure Firebase project is properly configured

## 📞 Support

For technical issues:
1. Check Firebase Console logs
2. Verify deployment status
3. Review browser console errors
4. Ensure all dependencies installed

## 🔄 Updates

To update content:
1. Login to CMS dashboard
2. Navigate to desired section
3. Edit content using forms
4. Changes appear immediately on website

---

**Built with ❤️ for Our Lady of Fatima Church**
