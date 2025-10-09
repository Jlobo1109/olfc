const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Optional: limit max concurrent instances to control cost
setGlobalOptions({ maxInstances: 10 });

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ----------------------------- ABOUT HISTORY API -----------------------------
app.get("/about/about_history", async (req, res) => {
  try {
    const snapshot = await db.collection("about_history").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data[0] || { title: "", content: [] });
  } catch (err) {
    logger.error("Error fetching About History:", err);
    res.status(500).json({ error: "Failed to fetch About History" });
  }
});

app.post("/about/about_history", async (req, res) => {
  try {
    const { id, title, content } = req.body;
    if (!title || !content || !Array.isArray(content)) {
      return res.status(400).json({ error: "Title and content array are required" });
    }

    if (id) {
      await db.collection("about_history").doc(id).set({ title, content }, { merge: true });
      res.json({ message: "About History updated successfully" });
    } else {
      await db.collection("about_history").add({ title, content });
      res.json({ message: "About History added successfully" });
    }
  } catch (err) {
    logger.error("Error saving About History:", err);
    res.status(500).json({ error: "Failed to save About History" });
  }
});

// Export Express app as a single Cloud Function
exports.api = onRequest(app);
