import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import Chat from "./models/Chat.js";
import User from "./models/User.js";
import requireAuth from "./middleware/auth.js";

dotenv.config();


const app = express();

// Validate model import at startup (helps detect “Chat is not defined” / wrong file execution)
console.log("[startup] Chat typeof:", typeof Chat);


app.use(cors());
app.use(express.json());

const PORT = 5000;

const client = new OpenAI({

  baseURL: "https://openrouter.ai/api/v1",

  apiKey: process.env.OPENROUTER_API_KEY,

});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;

let mongoReady = false;

if (!mongoUri) {
  console.warn("[startup] Missing MONGODB_URI env var. Chat persistence disabled.");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      mongoReady = true;
      console.log("[startup] MongoDB connected");
    })
    .catch((err) => {
      console.error("[startup] MongoDB connection error:", err);
      mongoReady = false;
    });
}


// Auth: signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.createUser({ email, password });

    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Auth: login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await user.verifyPassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Login failed" });
  }
});

// Get recent chats (authenticated)
app.get("/api/chats", requireAuth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      chats: chats.map((c) => ({
        id: c._id,
        userMessage: c.userMessage,
        botReply: c.botReply,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "AI Error" });
  }
});

app.post("/api/chat", requireAuth, async (req, res) => {

  try {

    const { message } = req.body;


    if (!message) {

      return res.status(400).json({
        reply: "Message required",
      });

    }

    // NOTE: OpenRouter model names differ by provider and availability.
    // If deepseek free model is not available, this will return 404.
    // Switch to a widely available DeepSeek model, or set MODEL_NAME in env.
    const model = process.env.MODEL_NAME || "deepseek/deepseek-chat";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const botReply = completion.choices?.[0]?.message?.content || "AI Error";

    // Save chat to MongoDB (if connected)
    if (mongoReady) {
      await Chat.create({
        userId: req.user.id,
        userMessage: message,
        botReply,
        createdAt: new Date(),
      });
    }



    res.json({
      reply: botReply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      reply: "AI Error",

    });

  }

});

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});