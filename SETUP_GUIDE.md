# Gemini API Project - Setup Guide

Complete guide to set up this Gemini AI chat project from scratch.

---

## 🎯 What We Built

A **dual-mode Gemini AI application**:
1. **Web Interface** - Beautiful chat UI running on `http://localhost:3000`
2. **Command Line** - Simple console-based interaction

Both modes use the **Google Gemini 2.5 Flash** model.

---

## 📋 Prerequisites

- **Windows 10/11** with PowerShell
- **nvm for Windows** (Node Version Manager) - [Download here](https://github.com/coreybutler/nvm-windows/releases)
- **A Google Gemini API Key** - [Get one here](https://aistudio.google.com/app/apikey)

---

## 🚀 Setup Instructions

### Step 1: Install Node.js v22 (Latest LTS)

```powershell
# Install Node.js v22
nvm install 22

# Activate it
nvm use 22.20.0

# Verify installation
node --version
# Should show: v22.20.0
```

### Step 2: Create Project Directory

```powershell
# Create and navigate to project folder
mkdir GeminiAPI-test
cd GeminiAPI-test
```

### Step 3: Initialize npm Project

```powershell
# Create package.json
npm init -y
```

### Step 4: Install Dependencies

```powershell
# Install required packages
npm install @google/genai
npm install dotenv
npm install express cors
```

### Step 5: Configure package.json

Update your `package.json` to include ES6 modules and scripts:

```json
{
  "name": "geminiapi-test",
  "version": "1.0.0",
  "description": "Vanilla JavaScript project using Google Gen AI SDK",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "web": "node server.js"
  },
  "dependencies": {
    "@google/genai": "^1.25.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.1"
  }
}
```

### Step 6: Create Security Files

**Create `.gitignore`:**
```
node_modules/
.env
*.log
.DS_Store
```

**Create `.env` (with YOUR API key):**
```
GEMINI_API_KEY=your_api_key_here
```

⚠️ **IMPORTANT**: Replace `your_api_key_here` with your actual API key from Google AI Studio!

### Step 7: Create Application Files

**Create `index.js`** (Command-line version):
```javascript
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not set!");
  console.log("\nPlease create a .env file with: GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

const ai = new GoogleGenAI({});

async function main() {
  try {
    console.log("🚀 Sending request to Gemini 2.5 Flash...\n");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
    });
    
    console.log("✅ Response from Gemini:");
    console.log(response.text);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
```

**Create `server.js`** (Web server):
```javascript
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY not set in .env file!");
  process.exit(1);
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`📩 Received: ${message}`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    console.log(`✅ Response sent`);
    res.json({ response: response.text });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
});
```

### Step 8: Create Web Interface

**Create `public/` folder structure:**
```
public/
  ├── index.html
  ├── style.css
  └── script.js
```

Copy the web interface files from this project:
- `public/index.html` - The main HTML structure
- `public/style.css` - Beautiful purple gradient styling
- `public/script.js` - Client-side chat functionality

(See the actual files in this repository for the complete code)

---

## 🎮 Running the Project

### Option 1: Web Interface (Recommended)

```powershell
# Start the web server
npm run web

# Open your browser to: http://localhost:3000
```

You'll see a beautiful chat interface where you can have conversations with Gemini AI!

### Option 2: Command Line

```powershell
# Run a single command-line request
npm start
```

This sends one predefined prompt and displays the response.

---

## 🔧 Troubleshooting

### PowerShell Execution Policy Error

If you see: *"running scripts is disabled on this system"*

**Solution 1** (Easiest): Use Command Prompt instead of PowerShell
```cmd
npm run web
```

**Solution 2**: Use the full npm path in PowerShell
```powershell
C:\nvm4w\nodejs\npm.cmd run web
```

**Solution 3**: Change execution policy (requires admin)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### API Key Not Working

1. Verify your API key is correct in `.env` file
2. Check there are no extra spaces or quotes around the key
3. Make sure the file is named exactly `.env` (not `.env.txt`)
4. Try regenerating your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Server Already Running on Port 3000

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## 📂 Project Structure

```
GeminiAPI-test/
├── node_modules/          # Dependencies (auto-generated)
├── public/                # Web interface files
│   ├── index.html        # Chat UI structure
│   ├── style.css         # Styling and animations
│   └── script.js         # Client-side JavaScript
├── .env                  # API key (DO NOT COMMIT!)
├── .gitignore           # Git ignore rules
├── index.js             # Command-line version
├── server.js            # Web server
├── package.json         # Project configuration
└── README.md            # Documentation

```

---

## 🔒 Security Best Practices

✅ **DO:**
- Keep your API key in `.env` file
- Add `.env` to `.gitignore`
- Never share your API key publicly
- Regenerate keys if accidentally exposed

❌ **DON'T:**
- Commit `.env` to Git
- Hard-code API keys in source files
- Share screenshots with API keys visible
- Use production API keys for testing

---

## 🌟 Features

### Web Interface
- ✨ Beautiful modern UI with gradient design
- 💬 Real-time chat with Gemini AI
- 📱 Responsive (works on mobile & desktop)
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- 🔄 Loading indicators
- 🎨 Smooth animations

### Command Line
- ⚡ Quick single-request testing
- 🎯 Simple and lightweight
- 📊 Console output

---

## 📚 Learn More

- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Google Gen AI SDK - npm](https://www.npmjs.com/package/@google/genai)
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/starter/installing.html)

---

## 💡 What's Next?

Ideas to extend this project:
- Add conversation history/memory
- Implement file upload for vision models
- Add speech-to-text input
- Create a chatbot with personality
- Integrate with Discord/Slack
- Add markdown rendering for responses
- Save chat history to database

---

**Happy Coding! 🚀**


