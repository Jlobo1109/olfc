const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

const app = express();

// Allow requests from your frontend
// Using environment variables or a default list
const allowedOrigins = [
    "https://olfatimachurch-b8123.web.app",
    "https://olfcmajiwada.com",
    "https://www.olfcmajiwada.com",
    "https://admin.olfcmajiwada.com",
    "http://localhost:3000", // For development
    "http://localhost:5000", // For local hosting emulation
    "http://127.0.0.1:5000"
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

app.use(express.json());

// --- Middleware ---

// Authentication & Authorization Middleware (RBAC)
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        // RBAC: Check for admin custom claim
        if (decodedToken.admin !== true) {
            console.warn(`Access denied: User ${decodedToken.email} is not an admin.`);
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Input Validation Helper
const validateBody = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => !req.body[field] && req.body[field] !== false);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Bad Request: Missing required fields',
                missing: missingFields
            });
        }
        next();
    };
};

// --- Public Content Endpoints (Read-Only) ---

app.get("/about/about_history", async (req, res) => {
    try {
        const docRef = db.collection("about_history").doc("main");
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Content not found" });
        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching about_history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/hero", async (req, res) => {
    try {
        const docRef = db.collection("hero_content").doc("main");
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Content not found" });
        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching hero content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/welcome", async (req, res) => {
    try {
        const docRef = db.collection("welcome_content").doc("main");
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Content not found" });
        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching welcome content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/mass-schedule", async (req, res) => {
    try {
        const docRef = db.collection("mass_schedule").doc("main");
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Content not found" });
        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching mass schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/parish-team", async (req, res) => {
    try {
        const snapshot = await db.collection("parish_team")
            .where("isActive", "==", true)
            .orderBy("order", "asc")
            .get();

        const teamMembers = [];
        snapshot.forEach(doc => {
            teamMembers.push({ id: doc.id, ...doc.data() });
        });
        res.json(teamMembers);
    } catch (error) {
        console.error("Error fetching parish team:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/events", async (req, res) => {
    try {
        const category = req.query.category || 'All';
        let query = db.collection("events")
            .where("isActive", "==", true)
            .where("isPublished", "==", true);

        if (category !== 'All') {
            query = query.where("category", "==", category);
        }

        const snapshot = await query.orderBy("date", "desc").get();
        const events = [];
        snapshot.forEach(doc => {
            events.push({ id: doc.id, ...doc.data() });
        });
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/communities", async (req, res) => {
    try {
        const snapshot = await db.collection("communities")
            .where("isActive", "==", true)
            .orderBy("name", "asc")
            .get();

        const communities = [];
        snapshot.forEach(doc => {
            communities.push({ id: doc.id, ...doc.data() });
        });
        res.json(communities);
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/associations", async (req, res) => {
    try {
        const snapshot = await db.collection("associations")
            .where("isActive", "==", true)
            .orderBy("name", "asc")
            .get();

        const associations = [];
        snapshot.forEach(doc => {
            associations.push({ id: doc.id, ...doc.data() });
        });
        res.json(associations);
    } catch (error) {
        console.error("Error fetching associations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/content/site-settings", async (req, res) => {
    try {
        const docRef = db.collection("site_settings").doc("main");
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Content not found" });
        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching site settings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// --- Protected CMS Endpoints (Admin Only) ---

// All /cms routes require authentication and admin claim
app.use("/cms", authenticateAdmin);

app.put("/cms/hero", async (req, res) => {
    try {
        const docRef = db.collection("hero_content").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        }, { merge: true });

        res.json({ success: true, message: "Hero content updated successfully" });
    } catch (error) {
        console.error("Error updating hero content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/welcome", async (req, res) => {
    try {
        const docRef = db.collection("welcome_content").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        }, { merge: true });

        res.json({ success: true, message: "Welcome content updated successfully" });
    } catch (error) {
        console.error("Error updating welcome content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/about-history", async (req, res) => {
    try {
        const docRef = db.collection("about_history").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        }, { merge: true });

        res.json({ success: true, message: "About history updated successfully" });
    } catch (error) {
        console.error("Error updating about history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/mass-schedule", async (req, res) => {
    try {
        const docRef = db.collection("mass_schedule").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        }, { merge: true });

        res.json({ success: true, message: "Mass schedule updated successfully" });
    } catch (error) {
        console.error("Error updating mass schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/cms/team-member", validateBody(['name', 'role']), async (req, res) => {
    try {
        const docRef = await db.collection("parish_team").add({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email,
            isActive: true
        });

        res.json({ success: true, message: "Team member added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/team-member/:id", async (req, res) => {
    try {
        const docRef = db.collection("parish_team").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Team member updated successfully" });
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/cms/team-member/:id", async (req, res) => {
    try {
        const docRef = db.collection("parish_team").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Team member deleted successfully" });
    } catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/cms/event", validateBody(['title', 'date']), async (req, res) => {
    try {
        const docRef = await db.collection("events").add({
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email,
            isActive: true,
            isPublished: true
        });

        res.json({ success: true, message: "Event added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/event/:id", async (req, res) => {
    try {
        const docRef = db.collection("events").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/cms/event/:id", async (req, res) => {
    try {
        const docRef = db.collection("events").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/cms/community", validateBody(['name']), async (req, res) => {
    try {
        const docRef = await db.collection("communities").add({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email,
            isActive: true
        });

        res.json({ success: true, message: "Community added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding community:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/community/:id", async (req, res) => {
    try {
        const docRef = db.collection("communities").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Community updated successfully" });
    } catch (error) {
        console.error("Error updating community:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/cms/community/:id", async (req, res) => {
    try {
        const docRef = db.collection("communities").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Community deleted successfully" });
    } catch (error) {
        console.error("Error deleting community:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/cms/association", validateBody(['title']), async (req, res) => {
    try {
        const docRef = await db.collection("associations").add({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email,
            isActive: true
        });

        res.json({ success: true, message: "Association added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding association:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/association/:id", async (req, res) => {
    try {
        const docRef = db.collection("associations").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Association updated successfully" });
    } catch (error) {
        console.error("Error updating association:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/cms/association/:id", async (req, res) => {
    try {
        const docRef = db.collection("associations").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        });

        res.json({ success: true, message: "Association deleted successfully" });
    } catch (error) {
        console.error("Error deleting association:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/cms/site-settings", async (req, res) => {
    try {
        const docRef = db.collection("site_settings").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedBy: req.user.email
        }, { merge: true });

        res.json({ success: true, message: "Site settings updated successfully" });
    } catch (error) {
        console.error("Error updating site settings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.api = functions.https.onRequest(app);

