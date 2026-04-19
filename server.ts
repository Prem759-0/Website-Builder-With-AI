import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import Stripe from "stripe";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Setup
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lumina";
let db: any;

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not found. Data persistence is disabled.");
    return;
  }
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Stripe Setup
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Projects API
app.get("/api/projects", async (req, res) => {
  if (!db) return res.json([]); 
  const userId = req.headers["x-user-id"];
  const projects = await db.collection("projects").find({ userId }).sort({ updatedAt: -1 }).toArray();
  res.json(projects);
});

app.post("/api/projects", async (req, res) => {
  if (!db) {
    return res.json({ name: req.body.name, userId: req.body.userId, code: req.body.code, _id: "demo-" + Date.now(), createdAt: new Date(), updatedAt: new Date() });
  }
  const { name, userId, code } = req.body;
  const project = {
    name,
    userId,
    code: code || "<h1>Hello World</h1>",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection("projects").insertOne(project);
  res.json({ ...project, _id: result.insertedId });
});

app.put("/api/projects/:id", async (req, res) => {
  if (!db) return res.json({ success: true });
  const { id } = req.params;
  const { name, code } = req.body;
  try {
    await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, code, updatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (e) {
    res.json({ success: true, warning: "Demo mode: not saved" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  if (!db) return res.json({ success: true });
  const { id } = req.params;
  try {
    await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: true });
  }
});

// AI Chat Proxy (OpenRouter)
app.post("/api/chat", async (req, res) => {
  const { messages, model } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: "OpenRouter API Key not configured. Please add it to your secrets." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model || "google/gemini-pro-1.5",
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    response.data.on("data", (chunk: any) => {
      res.write(chunk);
    });

    response.data.on("end", () => {
      res.end();
    });
  } catch (error: any) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to communicate with AI" });
  }
});

// Stripe Checkout
app.post("/api/checkout", async (req, res) => {
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  const { priceId, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  await connectDB();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
