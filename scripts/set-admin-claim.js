const admin = require('firebase-admin');
const serviceAccount = require('../functions/service-account.json'); // You'll need to provide this or run via firebase functions:shell

// Initialize Firebase Admin
// If running locally with credentials
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
} else {
    // If running within Cloud Functions environment or with explicit service account
    // For this script, we assume it's being run locally with a service account file or `firebase login` credentials might not be enough for setting claims without service account.
    // However, the easiest way for users is often `firebase functions:shell` or providing the path.

    // Let's rely on default credential loading if possible, or instruct user to set GOOGLE_APPLICATION_CREDENTIALS
    // or use `firebase emulators:start` and run against emulator.

    try {
        admin.initializeApp();
    } catch (e) {
        console.error("Failed to initialize admin. Make sure you have set GOOGLE_APPLICATION_CREDENTIALS or are running in an environment with access.");
        process.exit(1);
    }
}

const args = process.argv.slice(2);
const email = args[0];

if (!email) {
    console.error('Usage: node set-admin-claim.js <email>');
    process.exit(1);
}

async function setAdminClaim(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);

        await admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });

        console.log(`Success! Admin claim set for user: ${email}`);
        console.log('The user may need to sign out and sign back in for the change to take effect.');

    } catch (error) {
        console.error('Error setting admin claim:', error);
        process.exit(1);
    }
}

setAdminClaim(email);
