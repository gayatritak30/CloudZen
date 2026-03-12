import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are CodeZen, a programming assistant.
Rules:
1. Only answer programming, coding, debugging, software development, and technical questions.
2. Limit answers to 6 lines.
3. Code must be in fenced blocks with language tags.
4. If not programming related, say: "I'm CodeZen, I only answer programming questions."
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { message: "API Key missing. Please add GEMINI_API_KEY to Vercel." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try stable gemini-1.5-flash first, then fallback to gemini-pro if not found
    let modelName = "gemini-1.5-flash"; 
    let model;

    try {
      model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION
      });
      const result = await model.generateContent(message);
      const response = await result.response;
      return Response.json({ message: response.text() });
    } catch (innerError: any) {
      console.warn("Retrying with fallback model due to:", innerError.message);
      
      // Fallback to gemini-pro
      modelName = "gemini-pro";
      model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(SYSTEM_INSTRUCTION + "\n\nUser: " + message);
      const response = await result.response;
      return Response.json({ message: response.text() });
    }

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json(
      { message: `AI Error: ${error.message || "Connection failed. Please check your API Key tier."}` },
      { status: 500 }
    );
  }
}