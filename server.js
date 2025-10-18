import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not set!");
  console.log("\nPlease create a .env file with: GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
const ai = new GoogleGenAI({});

// API endpoint to extract events from text
app.post('/api/extract-events', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log(`📩 Extracting events from text (${text.length} chars)...`);

    // Use Gemini with structured output
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract all future events from the following text. For each event, identify the title/summary, date and time, and location if available. Return ONLY a JSON array.\n\nText:\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "Event title or summary"
              },
              startDateTime: {
                type: "string",
                description: "ISO 8601 date-time string (YYYY-MM-DDTHH:MM:SS)"
              },
              location: {
                type: "string",
                description: "Event location"
              },
              description: {
                type: "string",
                description: "Additional event details"
              }
            },
            required: ["summary", "startDateTime"]
          }
        }
      }
    });

    // Parse the JSON response
    const events = JSON.parse(response.text);
    
    // Add IDs to events
    const eventsWithIds = events.map((event, index) => ({
      ...event,
      id: index + 1
    }));

    console.log(`✅ Extracted ${eventsWithIds.length} events`);

    res.json({ events: eventsWithIds });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
});
