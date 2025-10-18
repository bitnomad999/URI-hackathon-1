# Gemini API Test Project

A vanilla JavaScript project using the Google Gen AI SDK to interact with Gemini models.

## Prerequisites

- Node.js v18+ (currently using v22.20.0)
- A Google AI Studio API key

## Setup

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. Set the API key as an environment variable:

   **Windows (PowerShell):**
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

   **Windows (Command Prompt):**
   ```cmd
   set GEMINI_API_KEY=your_api_key_here
   ```

   **Linux/Mac:**
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

3. Run the example:

   **Option 1: Using the batch file (easiest on Windows):**
   ```cmd
   run.bat
   ```

   **Option 2: Using npm directly:**
   
   If you encounter PowerShell execution policy errors, use Command Prompt:
   ```cmd
   npm start
   ```
   
   Or use the full path in PowerShell:
   ```powershell
   C:\nvm4w\nodejs\npm.cmd start
   ```

## Running the Project

### Option 1: Web Interface (Recommended)

Run the web server and open in your browser:

```bash
npm run web
```

Then open your browser and visit: **http://localhost:3000**

You'll see a beautiful chat interface where you can interact with Gemini AI in real-time!

### Option 2: Command Line

Run the simple command-line version:

```bash
npm start
```

This will send a single request to Gemini and display the response in the console.

## Troubleshooting

### PowerShell Execution Policy Error

If you see an error like "running scripts is disabled on this system", this is a Windows PowerShell security feature. You have several options:

1. **Use Command Prompt instead** (recommended): Open Command Prompt and run `npm start`
2. **Use the batch file**: Double-click `run.bat` or run it from Command Prompt
3. **Use the full path**: Run `C:\nvm4w\nodejs\npm.cmd start` in PowerShell
4. **Change execution policy** (requires admin): Run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Learn More

- [Google Gen AI SDK Documentation](https://ai.google.dev/gemini-api/docs)
- [API Reference](https://ai.google.dev/api/generate-content)

