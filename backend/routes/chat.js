const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");
const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// POST /api/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, userId, conversationId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!userId || !conversationId) {
      return res.status(400).json({ error: "userId and conversationId are required" });
    }

    const faqs = await Faq.find();
    const faqContext = faqs
      .map((faq) => `Keywords: ${faq.keywords.join(", ")}\nAnswer: ${faq.answer}`)
      .join("\n\n");

    const prompt = `
You are SynBot, the official HR and Onboarding Assistant of Synergy Labs.

Below is the company's FAQ knowledge base:

${faqContext}

Instructions:

1. Detect the language used by the employee.
   - If the question is in English → Reply in English.
   - If the question is in Hindi → Reply in Hindi.
   - If the question is in Hinglish (Hindi written in English letters) → Reply in Hinglish.
   - Always reply in the same language as the user.

2. Be friendly, professional, and helpful.

3. Keep answers short and clear (2-6 sentences unless more detail is needed).

4. Answer ONLY questions related to:
   - HR Policies
   - Onboarding
   - Office Timings
   - Leave Policy
   - Attendance
   - Salary
   - Probation
   - IT Setup
   - Employee Benefits
   - ID Card
   - Holidays
   - Work From Home
   - Company Rules

5. Use the FAQ information whenever it contains the answer.

6. If the answer is not present in the FAQ, provide a helpful HR response.

7. If the question is unrelated to Synergy Labs HR or onboarding, politely reply:
   "I'm sorry, I can only assist with Synergy Labs HR and onboarding-related queries."

Employee Question:
${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // Title: first message ke pehle 40 characters
    const existingCount = await Chat.countDocuments({ conversationId });
    let title;
    if (existingCount === 0) {
      title = message.slice(0, 40) + (message.length > 40 ? "..." : "");
    } else {
      const firstMsg = await Chat.findOne({ conversationId }).sort({ createdAt: 1 });
      title = firstMsg?.title || "New Chat";
    }

    const chat = new Chat({ userId, conversationId, title, message, reply });
    await chat.save();

    res.json({ reply, conversationId, title });

  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

// GET /api/conversations/:userId — sidebar ke liye conversations list
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Chat.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$conversationId",
          title: { $first: "$title" },
          lastUpdated: { $max: "$createdAt" },
        },
      },
      { $sort: { lastUpdated: -1 } },
    ]);
    res.json(conversations.map((c) => ({
      conversationId: c._id,
      title: c.title,
      lastUpdated: c.lastUpdated,
    })));
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/conversations/:userId/:conversationId — ek conversation ke messages
router.get("/conversations/:userId/:conversationId", async (req, res) => {
  try {
    const { userId, conversationId } = req.params;
    const messages = await Chat.find({ userId, conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;