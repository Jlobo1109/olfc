const { onRequest } = require("firebase-functions/v2/https");
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
    "https://olfatimachurch-b8123.firebaseapp.com",
    "https://olfcmajiwada.com",
    "https://www.olfcmajiwada.com",
    "https://admin.olfcmajiwada.com",
    "http://localhost:3000", // For development
    "http://localhost:5000", // For local hosting emulation
    "http://127.0.0.1:5000"
];

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    // Firebase Hosting preview channels (e.g. uat, PR previews)
    return /^https:\/\/olfatimachurch-b8123--[a-z0-9-]+\.web\.app$/.test(origin);
};

app.use(
    cors({
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
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

// --- Event Preview Endpoint (Dynamic OG Tags) ---
app.get("/e/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const doc = await db.collection("events").doc(eventId).get();
        
        if (!doc.exists) {
            return res.redirect("/parish.html");
        }
        
        const event = doc.data();
        const title = event.title || 'OLFC Event';
        
        let description = 'Join us for this event at Our Lady of Fatima Church.';
        if (event.description) {
            if (Array.isArray(event.description) && event.description.length > 0) {
                description = event.description[0].substring(0, 150) + '...';
            } else if (typeof event.description === 'string' && event.description.trim().length > 0) {
                description = event.description.substring(0, 150) + '...';
            }
        }
        
        let imageUrl = 'https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/hero.webp';
        if (event.images && event.images.length > 0) {
            const imgPath = event.images[0];
            if (imgPath.startsWith('http')) {
                imageUrl = imgPath;
            } else {
                imageUrl = `https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/${encodeURIComponent(imgPath)}?alt=media`;
            }
        }

        const host = req.get("x-forwarded-host") || req.get("host") || "olfcmajiwada.com";
        const protocol = req.get("x-forwarded-proto") || "https";
        const url = `${protocol}://${host}/e/${eventId}`;
        const redirectUrl = `/parish.html?event=${eventId}`;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Our Lady of Fatima Church</title>
    
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" itemprop="image" content="${imageUrl}">
    
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${imageUrl}">

    <script>
        window.location.replace("${redirectUrl}");
    </script>
</head>
<body>
    <p>Redirecting to event... <a href="${redirectUrl}">Click here if not redirected automatically.</a></p>
</body>
</html>`;

        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.status(200).send(html);
    } catch (error) {
        console.error("Error generating event preview:", error);
        res.redirect("/parish.html");
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

exports.api = onRequest({ region: "us-central1" }, app);

