require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve the frontend from a public folder if needed

// SECURITY: Rate Limiting
// Prevents API abuse and controls costs.
const analyzeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 analysis requests per windowMs
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// System Prompt for AI
const SYSTEM_PROMPT = `
You are an expert freelance consultant specializing in evaluating prospective client messages.
Analyze the client message objectively to identify both positive indicators (green flags) and potential risks (red flags).
Respond using EXACTLY this JSON format, and nothing else (no markdown blocks, just raw JSON). Ensure valid JSON.

{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "redFlags": ["issue 1", "issue 2"],
  "greenFlags": ["positive aspect 1", "positive aspect 2"],
  "explanation": "Briefly explain your overall assessment of the client",
  "recommendation": "Accept" | "Proceed with caution" | "Avoid",
  "suggestedReply": "A short, professional response the freelancer can send"
}

Rules:
- Be direct, objective, and practical.
- If the message is highly professional with clear scope and budget, set riskLevel to "LOW" and recommendation to "Accept".
- Identify green flags (e.g., respectful tone, clear requirements, fair budget).
- Identify red flags (e.g., payment issues, vague scope, unrealistic deadlines).
- If there are no red/green flags, return an empty array [].
- Do not repeat the original message.
- Keep responses concise.
`;

// Routes
app.post('/api/analyze', analyzeLimiter, async (req, res) => {
    try {
        const { message } = req.body;

        // SECURITY: Server-Side Validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid input. Message is required.' });
        }
        
        const trimmedMessage = message.trim();
        if (trimmedMessage.length === 0 || trimmedMessage.length > 5000) {
            return res.status(400).json({ error: 'Message must be between 1 and 5000 characters.' });
        }

        // SECURITY: Secrets Management
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('CRITICAL: GEMINI_API_KEY is not configured in the environment.');
            return res.status(503).json({ error: 'Analysis service is temporarily unavailable.' });
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nClient Message:\n" + trimmedMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.2, // Consistent analysis
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // SECURITY: Error Handling (Do not expose internal errors/status to client)
            console.error(`Upstream API Error: ${response.status}`);
            return res.status(502).json({ error: 'Failed to analyze message. Please try again later.' });
        }

        const data = await response.json();
        let jsonText = data.candidates[0].content.parts[0].text;
        
        // Strip out markdown if Gemini adds it despite instructions
        if (jsonText.startsWith('\`\`\`json')) {
            jsonText = jsonText.replace(/\`\`\`json\n/g, '').replace(/\`\`\`/g, '');
        } else if (jsonText.startsWith('\`\`\`')) {
            jsonText = jsonText.replace(/\`\`\`\n/g, '').replace(/\`\`\`/g, '');
        }

        const parsedResult = JSON.parse(jsonText.trim());

        // Respond with successfully parsed data. Do NOT permanently log the private client message.
        res.status(200).json(parsedResult);

    } catch (err) {
        // SECURITY: Generic Error Responses
        // Log the stack locally, but do not leak to the frontend.
        console.error('Error during analysis:', err); 
        res.status(500).json({ error: 'An unexpected internal error occurred.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ClientGuard Security Backend listening on port ${PORT}`);
});
