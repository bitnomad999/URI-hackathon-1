# 📅 AI Event Extractor - GitHub Pages Version

Turn any text into calendar events using AI!

## 🌐 Live Demo

This is the GitHub Pages version that runs entirely in your browser.

## ✨ Features

- 🤖 **AI-Powered Extraction**: Uses Google Gemini 2.5 Flash to intelligently extract events from any text
- 📝 **Structured Output**: Gemini returns properly formatted JSON with event details
- ✅ **Event Selection**: Choose which events to include in your calendar
- 📥 **ICS Generation**: Download a standard .ics file that works with Google Calendar, Outlook, Apple Calendar, etc.
- 🔒 **Privacy**: Your API key is stored locally in your browser only

## 🚀 How to Use

1. **Get an API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key (free tier available)

2. **Enter Your API Key**
   - Paste your API key in the input field
   - Click "Save Key" (it's stored in your browser's localStorage)

3. **Paste Your Text**
   - Copy any text containing event information (news articles, emails, schedules)
   - Or click "Try with Sample Data" to see it in action

4. **Extract Events**
   - Click "🔍 Extract Events"
   - Wait for AI to process (usually 2-5 seconds)

5. **Select & Download**
   - Review the extracted events
   - Uncheck any you don't want
   - Click "📥 Download Calendar (.ics)"

6. **Import to Your Calendar**
   - Open the downloaded .ics file
   - It will automatically open in your default calendar app
   - Or manually import it into Google Calendar, Outlook, etc.

## 📋 Example Input Text

```
University Events Calendar

Technology Conference 2025
Join us for the Annual Technology and Innovation Conference 
on October 25, 2025 at 2:00 PM at the University Convention Center.

Guest Lecture Series
Professor Jane Smith will present "The Future of AI" 
on November 3, 2025 at 4:30 PM in Science Hall Room 301.

Career Fair
The Fall Career Fair will be held on November 15, 2025 
from 10:00 AM to 3:00 PM at the Student Union Building.
```

## 🔧 Technical Details

### How It Works

1. **Text Input**: User pastes unstructured text
2. **AI Processing**: Text is sent to Gemini API with a structured output schema
3. **JSON Response**: Gemini returns events in a standardized format:
   ```json
   [
     {
       "summary": "Event Title",
       "startDateTime": "2025-10-25T14:00:00",
       "location": "Event Location",
       "description": "Event details..."
     }
   ]
   ```
4. **User Selection**: Events displayed with checkboxes for selection
5. **ICS Generation**: Selected events converted to iCalendar format
6. **Download**: User receives a standard .ics file

### API Configuration

The app uses Gemini's structured output feature:

```javascript
{
  responseMimeType: "application/json",
  responseSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        summary: { type: "string" },
        startDateTime: { type: "string" },
        location: { type: "string" },
        description: { type: "string" }
      },
      required: ["summary", "startDateTime"]
    }
  }
}
```

This ensures reliable, parseable output every time.

## 🔒 Security & Privacy

- ✅ Your API key never leaves your browser (except to call Google's API)
- ✅ No server-side storage of any data
- ✅ All processing happens client-side
- ✅ API key stored in browser localStorage only
- ⚠️ Don't share your API key with others
- ⚠️ Monitor your API usage in Google AI Studio

## 🆚 Differences from Node.js Version

| Feature | GitHub Pages | Node.js Server |
|---------|-------------|----------------|
| Deployment | Static hosting | Requires server |
| API Key | User provides own | Shared, hidden on server |
| Setup | Just open in browser | npm install required |
| Use Case | Personal use | Team/shared use |

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Any modern browser with ES6+ support

## 🐛 Troubleshooting

### "Failed to extract events"
- Check your API key is correct
- Verify you have API quota remaining
- Try with simpler text first

### No events found
- Make sure text includes dates and times
- Try being more explicit (use actual dates, not "tomorrow")
- Check that events are in the future

### Download doesn't work
- Check browser allows file downloads
- Try a different browser
- Disable popup blockers

## 🎓 Educational Use

This project demonstrates:
- Gemini API structured output
- Client-side API integration
- ICS file format generation
- Modern JavaScript ES6+
- Responsive web design

Perfect for learning AI integration without backend complexity!

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ using Google Gemini 2.5 Flash**

