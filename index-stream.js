import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not set!");
  console.log("\nPlease create a .env file with: GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

const ai = new GoogleGenAI({});

async function streamResponse(prompt) {
  try {
    console.log("🚀 Streaming response from Gemini 2.5 Flash...\n");
    console.log("💬 Gemini: ");
    
    // Use generateContentStream instead of generateContent
    const result = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Process the stream chunk by chunk
    for await (const chunk of result.stream) {
      // Write each chunk to the console as it arrives
      if (chunk.text) {
        process.stdout.write(chunk.text);
      }
    }
    
    console.log("\n\n✅ Stream complete!");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

// Example usage
streamResponse("Write a short poem about coding and AI working together");

