// Firebase Configuration - Browser-compatible approach
const firebaseConfig = {
    apiKey: "AIzaSyB4VkZb5Avvz6At_umIMNgsw7u0TbBP5VM",
    authDomain: "olfatimachurch-b8123.firebaseapp.com",
    projectId: "olfatimachurch-b8123",
    storageBucket: "olfatimachurch-b8123.firebasestorage.app",
    messagingSenderId: "148360742215",
    appId: "1:148360742215:web:4caac837a9ff30298ef862",
    measurementId: "G-GW38JPL144"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

class LoginApp {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        try {
            this.showLoading(true);
            this.hideError();

            await auth.signInWithEmailAndPassword(email, password);

            // Redirect to dashboard
            window.location.href = 'index.html';
        } catch (error) {
            this.showLoading(false);
            this.showError(this.getErrorMessage(error.code));
        }
    }


    getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No account found with this email address';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later';
            default:
                return 'Login failed. Please try again';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    showLoading(show) {
        const loginBtn = document.getElementById('loginBtn');
        const loading = document.getElementById('loading');

        if (show) {
            loginBtn.disabled = true;
            loginBtn.style.display = 'none';
            loading.style.display = 'block';
        } else {
            loginBtn.disabled = false;
            loginBtn.style.display = 'block';
            loading.style.display = 'none';
        }
    }
}

// Initialize login app
new LoginApp();
