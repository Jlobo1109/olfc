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
    "https://olfcmajiwada.com",
    "https://www.olfcmajiwada.com",
    "https://admin.olfcmajiwada.com",
    "http://localhost:3000", // For development
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

// Authentication middleware - Simplified for now
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        
        // For now, allow any authenticated user
        // TODO: Add proper admin role checking later
        console.log('Authenticated user:', decodedToken.email);
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Public content endpoints (no authentication required)
app.get("/about/about_history", async (req, res) => {
    try {
        const docRef = db.collection("about_history").doc("main");
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

// Get hero content
app.get("/content/hero", async (req, res) => {
    try {
        const docRef = db.collection("hero_content").doc("main");
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching hero content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get welcome content
app.get("/content/welcome", async (req, res) => {
    try {
        const docRef = db.collection("welcome_content").doc("main");
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching welcome content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get mass schedule
app.get("/content/mass-schedule", async (req, res) => {
    try {
        const docRef = db.collection("mass_schedule").doc("main");
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching mass schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get parish team
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

// Get events
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

// Get communities
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

// Get associations
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

// Get site settings
app.get("/content/site-settings", async (req, res) => {
    try {
        const docRef = db.collection("site_settings").doc("main");
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching site settings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Protected CMS endpoints (authentication required)
// Update hero content
app.put("/cms/hero", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("hero_content").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({ success: true, message: "Hero content updated successfully" });
    } catch (error) {
        console.error("Error updating hero content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update welcome content
app.put("/cms/welcome", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("welcome_content").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({ success: true, message: "Welcome content updated successfully" });
    } catch (error) {
        console.error("Error updating welcome content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update about history
app.put("/cms/about-history", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("about_history").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({ success: true, message: "About history updated successfully" });
    } catch (error) {
        console.error("Error updating about history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update mass schedule
app.put("/cms/mass-schedule", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("mass_schedule").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({ success: true, message: "Mass schedule updated successfully" });
    } catch (error) {
        console.error("Error updating mass schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add team member
app.post("/cms/team-member", authenticateUser, async (req, res) => {
    try {
        const docRef = await db.collection("parish_team").add({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        });

        res.json({ success: true, message: "Team member added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update team member
app.put("/cms/team-member/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("parish_team").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Team member updated successfully" });
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete team member
app.delete("/cms/team-member/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("parish_team").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Team member deleted successfully" });
    } catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add event
app.post("/cms/event", authenticateUser, async (req, res) => {
    try {
        const docRef = await db.collection("events").add({
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            isPublished: true
        });

        res.json({ success: true, message: "Event added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update event
app.put("/cms/event/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("events").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete event
app.delete("/cms/event/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("events").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add community
app.post("/cms/community", authenticateUser, async (req, res) => {
    try {
        const docRef = await db.collection("communities").add({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        });

        res.json({ success: true, message: "Community added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding community:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update community
app.put("/cms/community/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("communities").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Community updated successfully" });
    } catch (error) {
        console.error("Error updating community:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete community
app.delete("/cms/community/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("communities").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Community deleted successfully" });
    } catch (error) {
        console.error("Error deleting community:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add association
app.post("/cms/association", authenticateUser, async (req, res) => {
    try {
        const docRef = await db.collection("associations").add({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        });

        res.json({ success: true, message: "Association added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding association:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update association
app.put("/cms/association/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("associations").doc(req.params.id);
        await docRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Association updated successfully" });
    } catch (error) {
        console.error("Error updating association:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete association
app.delete("/cms/association/:id", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("associations").doc(req.params.id);
        await docRef.update({
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: "Association deleted successfully" });
    } catch (error) {
        console.error("Error deleting association:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update site settings
app.put("/cms/site-settings", authenticateUser, async (req, res) => {
    try {
        const docRef = db.collection("site_settings").doc("main");
        await docRef.set({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({ success: true, message: "Site settings updated successfully" });
    } catch (error) {
        console.error("Error updating site settings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


exports.api = functions.https.onRequest(app);
