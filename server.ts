import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import Stripe from "stripe";
import axios from "axios";
import { nanoid } from 'nanoid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Webhook needs raw body before express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) return res.status(400).send("Stripe not configured");

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    if (userId && db) {
      await db.collection("users").updateOne(
        { userId },
        { $set: { isPro: true, plan: "Pro", stripeCustomerId: session.customer } },
        { upsert: true }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    if (db) {
      await db.collection("users").updateOne(
        { stripeCustomerId: subscription.customer },
        { $set: { isPro: false, plan: "Free" } }
      );
    }
  }

  res.json({ received: true });
});

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
  try {
    const projects = await db.collection("projects").find({ userId }).sort({ updatedAt: -1 }).toArray();
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/projects", async (req, res) => {
  if (!db) {
    return res.json({ name: req.body.name, userId: req.body.userId, code: req.body.code, _id: "demo-" + Date.now(), createdAt: new Date(), updatedAt: new Date() });
  }
  const { name, userId, code } = req.body;

  try {
    // Usage Limit Check
    const count = await db.collection("projects").countDocuments({ userId });
    const user = await db.collection("users").findOne({ userId });
    const isPro = user?.isPro || false;
    const limit = isPro ? 100 : 5;

    if (count >= limit) {
      return res.status(403).json({ 
        error: "Usage limit reached", 
        message: isPro ? "You have reached your project limit." : "Free users are limited to 5 projects. Upgrade to Pro for unlimited access!" 
      });
    }

    const project = {
      name,
      userId,
      code: code || "<h1>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("projects").insertOne(project);
    res.json({ ...project, _id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Analytics API
app.get("/api/analytics", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!db) return res.json({ projects: 0, generations: 0, storage: "0MB" });
  
  try {
    const projectsCount = await db.collection("projects").countDocuments({ userId });
    const user = await db.collection("users").findOne({ userId });
    res.json({
      projects: projectsCount,
      generations: user?.generationsCount || 0,
      storage: (projectsCount * 0.1).toFixed(2) + "MB",
      plan: user?.isPro ? "Pro" : "Free"
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
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
    return res.status(401).json({ error: "OpenRouter API Key not configured." });
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

// AI Site Generation Engine (CORE)
app.post("/api/generate-site", async (req, res) => {
  const { prompt, currentCode } = req.body;
  const userId = req.headers["x-user-id"];
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: "OpenRouter API Key not configured." });
  }

  // Check Limits
  if (db && userId) {
    const user = await db.collection("users").findOne({ userId });
    const isPro = user?.isPro || false;
    const count = user?.generationsCount || 0;
    const limit = isPro ? 1000 : 5;

    if (count >= limit) {
      return res.status(403).json({ 
        error: "Generation limit reached", 
        message: "Free users are limited to 5 generations per day. Upgrade to Pro for unlimited creation!" 
      });
    }
  }

  const systemInstruction = `You are a world-class web builder AI like bolt.new or Lovable.
  Generate a professional, fully functional website based on the user's request.
  Use Tailwind CSS (via CDN) for styling. Ensure the code is responsive and high-quality.
  IMPORTANT: Return ONLY a valid JSON object in this format:
  {
    "title": "Project Title",
    "description": "Short description",
    "html": "<!DOCTYPE html><html>...</html>",
    "css": "/* styles */",
    "js": "// scripts"
  }
  Do not include markdown triple backticks around the JSON.
  Ensure the HTML contains the Tailwind CSS CDN script and a favicon link.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Prompt: ${prompt}\n\nCurrent Code (if any): ${currentCode || "None"}` }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const generated = typeof content === 'string' ? JSON.parse(content) : content;

    // Increment Usage
    if (db && userId) {
      await db.collection("users").updateOne(
        { userId },
        { $inc: { generationsCount: 1 } },
        { upsert: true }
      );
    }

    res.json(generated);
  } catch (error: any) {
    console.error("Generation Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate website" });
  }
});

// Export API
app.post("/api/export", async (req, res) => {
  const { html, css, js, name } = req.body;
  // This route acts as a metadata handler if needed, 
  // but zipping is best handled in the client for instant feedback.
  res.json({ success: true, message: "Ready for export" });
});
app.post("/api/checkout", async (req, res) => {
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  const { priceId, successUrl, cancelUrl, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
    });
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// In-memory store for published sites (use a DB for production)
const publishedSites = new Map<string, string>();

// Publish API
app.post("/api/publish", async (req, res) => {
  const { code } = req.body;
  const userId = req.headers["x-user-id"];

  if (!code) return res.status(400).json({ error: "No code to publish" });

  // Limit Check
  if (db && userId) {
    const user = await db.collection("users").findOne({ userId });
    const isPro = user?.isPro || false;
    const publishCount = user?.publishCount || 0;
    const limit = isPro ? 100 : 3;

    if (publishCount >= limit) {
      return res.status(403).json({ 
        error: "Publish limit reached", 
        message: "Free users can only publish 3 sites. Upgrade to Pro for more!" 
      });
    }

    await db.collection("users").updateOne(
      { userId },
      { $inc: { publishCount: 1 } },
      { upsert: true }
    );
  }

  const id = nanoid(10);
  publishedSites.set(id, code);
  
  res.json({ id, url: `${req.protocol}://${req.get('host')}/site/${id}` });
});

// Serve published sites
app.get("/site/:id", (req, res) => {
  const code = publishedSites.get(req.params.id);
  if (!code) return res.status(404).send("Site not found");
  
  res.setHeader("Content-Type", "text/html");
  res.send(code);
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
