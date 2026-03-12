import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are CodeZen, a coding mentor. Give technical answers in max 5 lines.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({ message: "API Key is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Attempt 1: Just try the most common model names directly
    const retryModels = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
    
    for (const name of retryModels) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent(SYSTEM_INSTRUCTION + "\n\n" + message);
        const response = await result.response;
        return Response.json({ message: response.text() });
      } catch (err: any) {
        if (!err.message.includes("404")) {
           // If it's not a 404, it might be a real error (like safety or key)
           throw err;
        }
        console.log(`Model ${name} not found, trying next...`);
      }
    }

    // Attempt 2: If we reach here, it's definitely a setup issue with the key
    return Response.json({ 
      message: `AI Error: Your API Key cannot find any compatible models. Please go to https://aistudio.google.com/ and create a NEW "API Key" in a new project, then update it in Vercel settings.` 
    }, { status: 500 });

  } catch (error: any) {
    return Response.json({ message: `AI Error: ${error.message}` }, { status: 500 });
  }
}