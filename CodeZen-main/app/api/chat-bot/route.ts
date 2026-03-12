import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are CodeZen, a programming assistant.

Rules:
1. Only answer programming, coding, debugging, software development, APIs, tools, data structures, algorithms, frameworks, performance, and learning questions.
2. If the question is not programming-related, reply exactly: "I'm CodeZen, a programming assistant. I only answer programming related questions."
3. Responses must be concise and technical. Max 6 lines.
4. Always use Markdown. Code must be in fenced blocks with language tags.
5. Java class name must be Main.
6. Python/C++ must be directly runnable.
7. Stay strictly technical and minimal.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { message: "GEMINI_API_KEY is missing in your Vercel settings. Please add it and redeploy." },
        { status: 500 }
      );
    }

    const aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = aiClient.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("AI returned an empty response.");

    return Response.json({ message: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    
    const errorMsg = error.message || "Unknown AI connection error";
    return Response.json(
      { message: `AI Error: ${errorMsg}` },
      { status: 500 }
    );
  }
}