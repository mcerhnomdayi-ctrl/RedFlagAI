document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const clientMessageInput = document.getElementById('client-message');
    const tryExampleBtn = document.getElementById('try-example');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyReplyBtn = document.getElementById('copy-reply');
    
    const inputSection = document.querySelector('.input-section');
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    
    // Result Elements
    const riskBadge = document.getElementById('risk-badge');
    const redFlagsCard = document.querySelector('.red-flags-card');
    const greenFlagsCard = document.querySelector('.green-flags-card');
    const redFlagsList = document.getElementById('red-flags-list');
    const greenFlagsList = document.getElementById('green-flags-list');
    const explanationText = document.getElementById('explanation-text');
    const recommendationBadge = document.getElementById('recommendation-badge');
    const suggestedReply = document.getElementById('suggested-reply');

    // Settings Modal Elements
    const settingsTrigger = document.getElementById('settings-trigger');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    const apiKeyInput = document.getElementById('api-key');

    // Example Message
    const exampleMessage = "Hi there! I absolutely love your work. I'm starting a massive new brand that is going to be the next Facebook, and I think you'd be perfect to build the whole app. We are currently look for co-founders so we cannot pay a standard rate right now, but we can offer you 5% equity which will be worth millions. Also, we need this done by next Friday to show investors. If you do a good job, we have tons of paid work coming. Let me know!";

    const mockResponseBad = {
        riskLevel: "HIGH",
        redFlags: [
            "Promises of 'exposure' or future massive equity instead of standard payment.",
            "Unrealistic timeline ('done by next Friday') for a 'massive app'.",
            "Vague project scope and attempting to hire a co-founder for a freelancer task.",
            "Manipulation tactic: 'If you do a good job, tons of paid work coming'."
        ],
        greenFlags: [],
        explanation: "This message contains classic signs of an exploitative client. They are attempting to get highly skilled labor for free by dangling the 'carrot' of future wealth and equity, which is statistically worthless. Combining this lack of funding with an extremely aggressive deadline indicates they do not respect your time and have unrealistic expectations.",
        recommendation: "Avoid",
        suggestedReply: "Hi [Name],\n\nThank you for reaching out! Your project sounds ambitious.\n\nHowever, my current business model does not allow me to take on equity-based or severely discounted projects. I only work on standard contract terms. Additionally, the timeline proposed is too tight for this scope.\n\nI wish you the best of luck.\n\nBest regards,\n[Your Name]"
    };

    const mockResponseGood = {
        riskLevel: "LOW",
        redFlags: [],
        greenFlags: [
            "Clear mention of a budget and willingness to pay your standard rate.",
            "Respectful and professional communication style.",
            "Understanding of realistic timelines and processes."
        ],
        explanation: "This client appears highly professional. They respect your time, have clearly mentioned a budget, and communicate their needs effectively without throwing up any red flags.",
        recommendation: "Accept",
        suggestedReply: "Hi [Name],\n\nThank you for reaching out. I'm very interested in this project and appreciate you providing clear details regarding the scope and timeline.\n\nI currently have availability to take this on. My standard rate aligns with your budget. I've attached a link to schedule a brief introductory call so we can iron out the final details and get a contract signed.\n\nLooking forward to speaking with you!\n\nBest regards,\n[Your Name]"
    };

    // System Prompt for Gemini
    const SYSTEM_PROMPT = `
You are an expert freelance consultant specializing in evaluating prospective client messages.
Analyze the client message objectively to identify both positive indicators (green flags) and potential risks (red flags).
Respond using EXACTLY this JSON format, and nothing else (no markdown blocks, just raw JSON). Ensure valid JSON.

{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "redFlags": ["issue 1", "issue 2"], // empty array [] if none
  "greenFlags": ["positive aspect 1", "positive aspect 2"], // empty array [] if none
  "explanation": "Briefly explain your overall assessment of the client",
  "recommendation": "Accept" | "Proceed with caution" | "Avoid",
  "suggestedReply": "A short, professional response the freelancer can send"
}

Rules:
- Be direct, objective, and practical.
- If the message is highly professional with clear scope and budget, set riskLevel to "LOW" and recommendation to "Accept".
- Identify green flags (e.g., respectful tone, clear requirements, fair budget, realistic deadlines).
- Identify red flags (e.g., payment issues, vague scope, unrealistic deadlines, manipulation, lowballing).
- If there are no red flags or no green flags, return an empty array [] for that field.
- Do not repeat the original message.
- Keep responses concise and easy to read.
`;

    // Initialize Setup
    init();

    function init() {
        // Load API key from local storage if it exists
        const savedKey = localStorage.getItem('redflag_ai_key');
        if (savedKey) {
            apiKeyInput.value = savedKey;
        }

        // Event Listeners
        tryExampleBtn.addEventListener('click', () => {
            clientMessageInput.value = exampleMessage;
            clientMessageInput.focus();
        });

        analyzeBtn.addEventListener('click', handleAnalysis);
        resetBtn.addEventListener('click', resetApp);
        
        copyReplyBtn.addEventListener('click', async () => {
            const textToCopy = suggestedReply.textContent;
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalText = copyReplyBtn.innerHTML;
                copyReplyBtn.innerHTML = '<i class="ph ph-check"></i> <span>Copied!</span>';
                copyReplyBtn.classList.add('success-btn');
                setTimeout(() => {
                    copyReplyBtn.innerHTML = originalText;
                    copyReplyBtn.classList.remove('success-btn');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        // Settings Modal events
        settingsTrigger.addEventListener('click', () => settingsModal.classList.remove('hidden'));
        closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
        
        // Close modal when clicking on backdrop
        settingsModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                settingsModal.classList.add('hidden');
            }
        });

        saveSettings.addEventListener('click', () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey) {
                localStorage.setItem('redflag_ai_key', newKey);
            } else {
                localStorage.removeItem('redflag_ai_key');
            }
            settingsModal.classList.add('hidden');
            
            // Visual feedback
            settingsTrigger.innerHTML = '<i class="ph ph-check text-gradient"></i>';
            setTimeout(() => {
                settingsTrigger.innerHTML = '<i class="ph ph-gear"></i>';
            }, 1000);
        });
    }

    async function handleAnalysis() {
        const message = clientMessageInput.value.trim();
        
        if (!message) {
            alert("Please paste a client message first.");
            return;
        }

        // UI State transition
        inputSection.classList.add('hidden');
        loadingState.classList.remove('hidden');

        try {
            const apiKey = localStorage.getItem('redflag_ai_key');
            let resultData;

            if (apiKey) {
                // Call actual Gemini API directly from browser
                resultData = await callGeminiAPI(message, apiKey);
            } else {
                // Simulating response because no key is provided
                console.warn("No API key provided. Using fallback demo responses.");
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const lowerMsg = message.toLowerCase();
                const isBad = lowerMsg.includes('exposure') || lowerMsg.includes('equity') || lowerMsg.includes('free') || lowerMsg.includes('cheap');
                const isGood = lowerMsg.includes('budget') || lowerMsg.includes('rate') || lowerMsg.includes('pay') || lowerMsg.includes('contract');
                
                if (isBad || message === exampleMessage) {
                    resultData = mockResponseBad;
                } else if (isGood) {
                    resultData = mockResponseGood;
                } else {
                    resultData = mockResponseGood; 
                }
            }

            renderResults(resultData);

            // Show results
            loadingState.classList.add('hidden');
            resultsSection.classList.remove('hidden');

        } catch (error) {
            alert("Analysis failed. Please check your API key if you're using one, or try again later.\n\nError: " + error.message);
            resetApp();
        }
    }

    async function callGeminiAPI(message, apiKey) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: SYSTEM_PROMPT + "\n\nClient Message:\n" + message }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.2, // Low temperature for more analytical/consistent output
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        try {
            // Extract the text content from the Gemini response
            let jsonText = data.candidates[0].content.parts[0].text;
            
            // Sometimes Gemini wraps JSON in markdown blocks despite instructions
            if (jsonText.startsWith('\`\`\`json')) {
                jsonText = jsonText.replace(/\`\`\`json\n/g, '').replace(/\`\`\`/g, '');
            } else if (jsonText.startsWith('\`\`\`')) {
                jsonText = jsonText.replace(/\`\`\`\n/g, '').replace(/\`\`\`/g, '');
            }

            return JSON.parse(jsonText.trim());
        } catch (e) {
            console.error("Failed to parse AI response as JSON", e);
            console.log("Raw output:", data.candidates[0]?.content?.parts[0]?.text);
            throw new Error("AI returned malformed data. Please try again.");
        }
    }

    function renderResults(data) {
        // Render Risk Badge
        const riskIcons = {
            "LOW": "ph-check-circle",
            "MEDIUM": "ph-warning",
            "HIGH": "ph-warning-circle"
        };
        const riskClasses = {
            "LOW": "risk-low",
            "MEDIUM": "risk-medium",
            "HIGH": "risk-high"
        };

        const level = data.riskLevel.toUpperCase();
        riskBadge.className = `badge ${riskClasses[level] || 'risk-medium'}`;
        riskBadge.innerHTML = `<i class="ph ${riskIcons[level] || 'ph-warning'}"></i> <span>${level} RISK</span>`;

        // Render Red Flags
        redFlagsList.innerHTML = '';
        if (data.redFlags && data.redFlags.length > 0) {
            redFlagsCard.classList.remove('hidden');
            data.redFlags.forEach(flag => {
                const li = document.createElement('li');
                li.textContent = flag;
                redFlagsList.appendChild(li);
            });
        } else {
            redFlagsCard.classList.add('hidden');
        }

        // Render Green Flags
        greenFlagsList.innerHTML = '';
        if (data.greenFlags && data.greenFlags.length > 0) {
            greenFlagsCard.classList.remove('hidden');
            data.greenFlags.forEach(flag => {
                const li = document.createElement('li');
                li.textContent = flag;
                greenFlagsList.appendChild(li);
            });
        } else {
            greenFlagsCard.classList.add('hidden');
        }

        // Render Explanation
        explanationText.textContent = data.explanation || "No explanation provided.";

        // Render Recommendation
        const recIcons = {
            "Accept": "ph-thumbs-up",
            "Proceed with caution": "ph-hand-waving",
            "Avoid": "ph-thumbs-down"
        };
        const recLevelClasses = {
            "Accept": "risk-low",
            "Proceed with caution": "risk-medium",
            "Avoid": "risk-high"
        };
        const rec = data.recommendation;
        recommendationBadge.className = `badge ${recLevelClasses[rec] || 'risk-medium'}`;
        recommendationBadge.innerHTML = `<i class="ph ${recIcons[rec] || 'ph-info'}"></i> <span>${rec}</span>`;

        // Render Reply
        suggestedReply.textContent = data.suggestedReply || "No reply suggested.";
    }

    function resetApp() {
        resultsSection.classList.add('hidden');
        loadingState.classList.add('hidden');
        inputSection.classList.remove('hidden');
        clientMessageInput.value = '';
        clientMessageInput.focus();
    }
});
