# 📅 AI Event Extractor

Extract events from any text and generate calendar files using Google's Gemini AI.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## ✨ Features

- 🤖 **AI-Powered**: Uses Gemini 2.5 Flash with structured output
- 📝 **Smart Extraction**: Paste any text, get events automatically
- ✅ **Event Selection**: Choose which events to include
- 📥 **Calendar Export**: Download standard .ics files
- 🎨 **Beautiful UI**: Modern, responsive interface

## 🎯 How It Works

1. Paste unstructured text (emails, schedules, news articles)
2. AI extracts event details (title, date, time, location)
3. Review and select events you want
4. Download as .ics file
5. Import to Google Calendar, Outlook, Apple Calendar, etc.

## 📋 Example Input

```
Tech Conference 2025
Join us on October 25, 2025 at 2:00 PM at the Convention Center.

Workshop: AI Basics
December 10, 2025 at 3:30 PM in Room 204.
```

## 🔧 Tech Stack

- **Backend**: Node.js + Express
- **AI**: Google Gemini 2.5 Flash
- **Frontend**: Vanilla JavaScript
- **Format**: iCalendar (.ics)

## 📁 Project Structure

```
├── server.js          # Express server with AI integration
├── public/            # Frontend files
│   ├── index.html    # Event extraction interface
│   ├── style.css     # Styling
│   └── script.js     # Client-side logic
├── .env              # API key (not committed)
├── .gitignore        # Ignore node_modules and .env
└── package.json      # Dependencies and scripts
```

## 🔒 Security

- API key stored in `.env` file on server
- Never exposed to client
- `.gitignore` prevents committing secrets

## 🐛 Troubleshooting

### Server won't start
- Make sure Node.js v18+ is installed
- Check `.env` file exists with valid API key
- Run `npm install` first

### No events extracted
- Make sure text includes dates and times
- Try more explicit date formats
- Check API key is valid

### PowerShell errors
Use Command Prompt or run:
```powershell
C:\nvm4w\nodejs\npm.cmd start
```

## 📄 License

MIT License

---

**Built for URI Hackathon 2025** 🎓
