import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not set!");
  console.log("\nPlease set your API key first:");
  console.log("  Option 1: Create a .env file with: GEMINI_API_KEY=your_api_key_here");
  console.log("  Option 2: Set environment variable:");
  console.log("    PowerShell: $env:GEMINI_API_KEY='your_api_key_here'");
  console.log("    CMD:        set GEMINI_API_KEY=your_api_key_here");
  console.log("\nGet your API key from: https://aistudio.google.com/app/apikey");
  process.exit(1);
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
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

