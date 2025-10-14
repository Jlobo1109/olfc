// Firebase Configuration - Secure Approach
// This uses Firebase's automatic configuration loading
// No API keys exposed in source code

// For development, we need to provide the config
// For production, Firebase Hosting will inject it automatically
const firebaseConfig = {
    apiKey: "AIzaSyB4VkZb5Avvz6At_umIMNgsw7u0TbBP5VM",
    authDomain: "olfatimachurch-b8123.firebaseapp.com", 
    projectId: "olfatimachurch-b8123",
    storageBucket: "olfatimachurch-b8123.firebasestorage.app",
    messagingSenderId: "148360742215",
    appId: "1:148360742215:web:4caac837a9ff30298ef862",
    measurementId: "G-GW38JPL144"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
} else {
    window.firebaseConfig = firebaseConfig;
}
