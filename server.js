const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createEvents } = require('ics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Debug endpoint to test API key and list models
app.get('/api/debug', async (req, res) => {
  console.log('🔍 DEBUG: Testing API key...');
  console.log('🔑 DEBUG: API key exists:', !!process.env.GEMINI_API_KEY);
  console.log('🔑 DEBUG: API key preview:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'undefined');
  
  try {
    // First, let's try to list available models
    console.log('🔍 DEBUG: Fetching available models...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    const modelsData = await response.json();
    
    console.log('📋 DEBUG: Available models:', JSON.stringify(modelsData, null, 2));
    
    // Extract model names
    const modelNames = modelsData.models ? modelsData.models.map(m => m.name) : [];
    
    res.json({ 
      status: 'success', 
      message: 'API key is working!', 
      availableModels: modelNames,
      apiKeyExists: !!process.env.GEMINI_API_KEY
    });
  } catch (error) {
    console.error('❌ DEBUG: API test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'API test failed', 
      error: error.message,
      apiKeyExists: !!process.env.GEMINI_API_KEY
    });
  }
});

app.post('/api/extract-events', async (req, res) => {
  console.log('🔍 DEBUG: Extract events request received');
  console.log('📝 DEBUG: Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { text } = req.body;
    
    console.log('📊 DEBUG: Text length:', text ? text.length : 'undefined');
    console.log('🔑 DEBUG: API key exists:', !!process.env.GEMINI_API_KEY);
    console.log('🔑 DEBUG: API key preview:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'undefined');
    
    if (!text || text.trim().length === 0) {
      console.log('❌ DEBUG: No text provided');
      return res.status(400).json({ error: 'Text input is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ DEBUG: No API key configured');
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    console.log('🤖 DEBUG: Initializing Gemini model...');
    // Get the Gemini model - use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log('✅ DEBUG: Model initialized successfully');

    const prompt = `
Extract events from the following text and return them as a JSON array. Each event should have:
- title: string (event name/title)
- date: string (YYYY-MM-DD format)
- time: string (HH:MM format, 24-hour)
- location: string (venue/address, or "TBD" if not specified)
- description: string (brief description, or empty string if none)

Text to analyze:
${text}

Return only valid JSON array, no other text. If no events are found, return an empty array [].
`;

    console.log('📤 DEBUG: Sending prompt to Gemini...');
    console.log('📝 DEBUG: Prompt length:', prompt.length);
    
    const result = await model.generateContent(prompt);
    console.log('✅ DEBUG: Got response from Gemini');
    
    const response = await result.response;
    const extractedText = response.text();
    
    console.log('📄 DEBUG: Raw response from Gemini:', extractedText);

    // Parse the JSON response
    let events;
    try {
      console.log('🔍 DEBUG: Attempting to parse JSON response...');
      
      // Clean the response - remove markdown code blocks if present
      let cleanedText = extractedText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      console.log('🧹 DEBUG: Cleaned response:', cleanedText);
      
      events = JSON.parse(cleanedText);
      console.log('✅ DEBUG: JSON parsed successfully');
      console.log('📊 DEBUG: Parsed events:', JSON.stringify(events, null, 2));
    } catch (parseError) {
      console.error('❌ DEBUG: Error parsing Gemini response:', parseError);
      console.error('❌ DEBUG: Raw response that failed to parse:', extractedText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Validate and clean events
    console.log('🔍 DEBUG: Validating events...');
    const validEvents = events.filter(event => 
      event.title && 
      event.date && 
      event.time &&
      typeof event.title === 'string' &&
      typeof event.date === 'string' &&
      typeof event.time === 'string'
    );
    
    console.log('📊 DEBUG: Valid events count:', validEvents.length);
    console.log('📊 DEBUG: Valid events:', JSON.stringify(validEvents, null, 2));

    res.json({ events: validEvents });

  } catch (error) {
    console.error('❌ DEBUG: Error extracting events:', error);
    console.error('❌ DEBUG: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to extract events' });
  }
});

app.post('/api/generate-calendar', (req, res) => {
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Events array is required' });
    }

    // Convert events to ICS format
    const icsEvents = events.map(event => {
      const [year, month, day] = event.date.split('-').map(Number);
      const [hour, minute] = event.time.split(':').map(Number);
      
      return {
        title: event.title,
        start: [year, month, day, hour, minute],
        duration: { hours: 1 }, // Default 1 hour duration
        description: event.description || '',
        location: event.location || '',
        status: 'CONFIRMED',
        busyStatus: 'BUSY'
      };
    });

    const { error, value } = createEvents(icsEvents);
    
    if (error) {
      console.error('Error creating ICS:', error);
      return res.status(500).json({ error: 'Failed to generate calendar file' });
    }

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="events.ics"');
    res.send(value);

  } catch (error) {
    console.error('Error generating calendar:', error);
    res.status(500).json({ error: 'Failed to generate calendar file' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI Event Extractor running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set GEMINI_API_KEY in your .env file`);
});
