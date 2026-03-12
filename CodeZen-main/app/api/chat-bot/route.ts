import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are CodeZen, a coding mentor. Only answer programming questions in max 6 lines. Use Markdown code blocks.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({ message: "API Key is missing in environment variables." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List of model names to try in order
    const modelsToTry = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-pro",
      "gemini-1.0-pro"
    ];

    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Simple generation
        const result = await model.generateContent(SYSTEM_INSTRUCTION + "\n\nUser Question: " + message);
        const response = await result.response;
        const text = response.text();

        if (text) {
          return Response.json({ message: text });
        }
      } catch (e: any) {
        console.error(`Failed with ${modelName}:`, e.message);
        lastError = e.message;
        // Continue to next model
      }
    }

    // If all fail
    return Response.json({ 
      message: `AI Error: All models failed. Last Error: ${lastError}. Please ensure "Generative Language API" is enabled in your Google AI Studio project.` 
    }, { status: 500 });

  } catch (error: any) {
    return Response.json({ message: "System Error: " + error.message }, { status: 500 });
  }
}