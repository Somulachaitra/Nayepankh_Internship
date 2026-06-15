/* ===========================================================
   NayePankh AI — Express Backend Server
   -----------------------------------------------------------
   • Serves static files (HTML, CSS, JS, images)
   • Proxies AI chat requests to Google Gemini API (secret key
     stays server-side, never sent to the browser)
   • All secrets loaded from .env via dotenv
   =========================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Serve HTML pages from /pages directory without prefix or .html extension ----------
const pagesDir = path.join(__dirname, 'public', 'pages');
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.html')) {
    const routeName = path.parse(file).name; // filename without extension
    app.get(`/${routeName}`, (req, res) => {
      res.sendFile(path.join(pagesDir, file));
    });

    // Also handle routes with trailing slash
    app.get(`/${routeName}/`, (req, res) => {
      res.sendFile(path.join(pagesDir, file));
    });
  }
});

// ---------- Serve static files ----------
// Serve the entire project directory as static files
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Gemini AI Chat Route ----------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are Pankh AI, the friendly and knowledgeable virtual assistant for NayePankh Foundation — a registered NGO in India (UP Government, 80G & 12A certified).

Your role is to help visitors learn about the foundation, its programs, how to donate, how to volunteer, and the impact created. Always be warm, helpful, and encouraging.

Key facts about NayePankh Foundation:
- Founded by Prashant Shukla in 2020
- Headquartered in Kanpur, Uttar Pradesh, India
- Contact: contact@nayepankh.com, +91-8318500748
- Social media: @nayepankhfoundation (Instagram, Facebook, YouTube), @nayepankh (Twitter)
- 200,000+ lives touched, 50,000+ meals served, 15,000+ children educated, 8,000+ women supported
- 120+ active student volunteers, operations in 10+ cities across UP

Programs:
1. Padho Padhao — Free education & school supplies for underprivileged children
2. Anna Daan — Nutritious meal distribution in slum areas
3. Sakhi — Menstrual hygiene & sanitary pad distribution for women & girls
4. Vastra Daan — Clothing drives for families in need
5. Skill Shakti — Vocational training & livelihood programs
6. Digital Saksharta — Computer & digital literacy workshops

Donations:
- All donations are 80G tax-exempted
- One-time donations, monthly sponsorships (₹2,500/month for a child's education), in-kind gifts, and corporate CSR partnerships
- Every ₹500 provides school supplies for 5 children for a month

Volunteering:
- On-ground: food distribution, teaching, event support
- Skill-based: design, content, social media, tech
- Remote: translation, research, fundraising
- Internships available for students

Certificates: UP Government Registered, 80G, 12A, CSR Registered

Guidelines:
- Keep responses concise but informative (under 200 words)
- Use bullet points and emojis for readability
- If asked something outside NayePankh's scope, politely redirect
- Always encourage action: donate, volunteer, or spread the word
- Format responses with markdown for bold text and bullet points`;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Gemini API key not configured',
      fallback: true
    });
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      return res.status(502).json({ error: 'AI service unavailable', fallback: true });
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return res.status(502).json({ error: 'Empty AI response', fallback: true });
    }

    res.json({ response: aiText });
  } catch (err) {
    console.error('Chat API error:', err.message);
    res.status(500).json({ error: 'Internal server error', fallback: true });
  }
});

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`
  ╔═════════════════════════════════════════════════╗
  ║   🌟 NayePankh AI Server                    ║
  ║   Running at http://127.0.0.1:${PORT}           ║
  ║                                              ║
  ║   Gemini AI:  ${GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}              ║
  ║   Static:     ✅ Serving from ./             ║
  ╚═════════════════════════════════════════════════╝
  `);
});