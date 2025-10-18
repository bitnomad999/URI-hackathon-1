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

// API endpoint to chat with Gemini (streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`📩 Received: ${message}`);

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Use streaming API
    const result = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: message,
    });

    // Stream each chunk to the client
    for await (const chunk of result.stream) {
      if (chunk.text) {
        // Send chunk as SSE data
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    // Signal end of stream
    res.write('data: [DONE]\n\n');
    res.end();
    
    console.log(`✅ Stream complete`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
});


