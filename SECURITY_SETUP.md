# 🔐 Security Setup Instructions

## Firebase Configuration Security

To protect your Firebase API keys from being exposed in your repository, follow these steps:

### 1. Create Firebase Configuration File

**IMPORTANT**: The `js/firebase-config.js` file is now in `.gitignore` and will NOT be committed to the repository.

You need to create this file manually with your Firebase configuration:

```bash
# Copy the template
cp js/firebase-config.template.js js/firebase-config.js

# Edit the file with your actual Firebase configuration
nano js/firebase-config.js
```

### 2. Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/project/olfatimachurch-b8123/settings/general)
2. Scroll to "Your apps" section
3. Click the gear icon next to your web app
4. Copy the configuration object
5. Replace the values in `js/firebase-config.js`

### 3. Example Configuration

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB4VkZb5Avvz6At_umIMNgsw7u0TbBP5VM",
    authDomain: "olfatimachurch-b8123.firebaseapp.com",
    projectId: "olfatimachurch-b8123",
    storageBucket: "olfatimachurch-b8123.firebasestorage.app",
    messagingSenderId: "148360742215",
    appId: "1:148360742215:web:4caac837a9ff30298ef862",
    measurementId: "G-GW38JPL144"
};
```

### 4. Deploy

After creating the configuration file:

```bash
firebase deploy --only hosting
```

## 🔒 Security Benefits

- ✅ **API keys are not in version control**
- ✅ **Configuration is centralized**
- ✅ **Easy to update without code changes**
- ✅ **Template file for new deployments**

## ⚠️ Important Notes

- **Never commit `js/firebase-config.js`** - it's in `.gitignore`
- **Keep the template file** for new deployments
- **Update the config file** when Firebase settings change
- **Use environment variables** in production environments
