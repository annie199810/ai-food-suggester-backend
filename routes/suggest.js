const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Suggestion = require("../models/Suggestion");
const authMiddleware = require("../middleware/auth");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;
    console.log("Query received:", query);
    console.log("User:", req.user);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are a helpful Indian food assistant. Suggest a home-cooked Indian food dish based on this: "${query}". Keep response short and friendly.`
        }
      ],
      model: "llama-3.3-70b-versatile",
    });
    
    console.log("Groq response received!");
    const suggestion = completion.choices[0].message.content;
    await Suggestion.create({ userId: req.user.id, query, suggestion });
    res.json({ suggestion });
  } catch (err) {
    console.log("FULL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await Suggestion.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;