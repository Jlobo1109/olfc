const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

const app = express();

// Allow requests from your frontend
const allowedOrigins = [
    "https://olfatimachurch-b8123.web.app",
    "https://olfcmajiwada.com"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);


// Get about_history from Firestore
app.get("/about/about_history", async (req, res) => {
    try {
        const docRef = db.collection("about_history").doc("about_history"); // Firestore path
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching about_history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.api = functions.https.onRequest(app);
