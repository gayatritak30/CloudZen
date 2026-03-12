import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ message: "API Key is missing." }, { status: 500 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Restoring the specific version requested by user

      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        systemInstruction: [
          {
            text: `
You are CodeZen, a programming assistant.

Rules:
- Only answer programming, coding, debugging, development questions.
- If not programming-related, say: "I'm CodeZen, a programming assistant. I only answer programming related questions."
- Responses must be concise (max 6 lines).
- Always use Markdown for code. Java class name must be 'Main'.
- Explanation first, then code. No emojis.
- Stay strictly technical and minimal.
            `,
          },
        ],
      },
    });

    return Response.json({ message: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    
    // Fallback logic if 2.5-flash fails (though it appeared in the list)
    try {
        console.log("Attempting fallback to gemini-2.0-flash...");
        const fallbackResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: message }] }],
        });
        return Response.json({ message: fallbackResponse.text });
    } catch (fallbackError: any) {
        return Response.json({ 
            message: `AI Error: ${error.message}. Please verify your API Key permissions and the model name.` 
        }, { status: 500 });
    }
  }
}