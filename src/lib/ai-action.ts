import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const flashcardSchema = z.object({
  id: z.string(),
  topic: z.string(),
  badge: z.string().optional(),
  wrote: z.string(),
  correction: z.string(),
  deepDive: z.string(),
});

const analysisSchema = z.object({
  cards: z.array(flashcardSchema),
  focusAreas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(["Needs Review", "Almost There", "Doing Great"]),
      nextStep: z.string(),
    })
  ).max(3),
  recommendation: z.string(),
});

export const analyzeAnswers = createServerFn({ method: "POST" })
  .validator((data: { imageBase64?: string; mimeType?: string }) => data)
  .handler(async ({ data }) => {
    // If no API key is provided, we return a fallback response so the UI doesn't break
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
      console.warn("No GOOGLE_GENERATIVE_AI_API_KEY found. Returning mock data.");
      return {
        cards: [
          {
            id: "grammar-mock",
            topic: "Grammar · Articles",
            badge: "🚨 API Key Missing",
            wrote: "a apple",
            correction: "an apple",
            deepDive: "This is a mock response because GOOGLE_GENERATIVE_AI_API_KEY is not set in your .env file.",
          },
        ],
        focusAreas: [
          {
            title: "API Key Missing",
            description: "Live AI analysis is paused because the API key is not configured.",
            status: "Needs Review",
            nextStep: "Set your GEMINI_API_KEY in the .env file.",
          },
        ],
        recommendation: "Create a .env file at the root of your project and add GEMINI_API_KEY=your_api_key_here to see real AI analysis. You've got this!",
      };
    }

    try {
      const { object } = await generateObject({
        model: google("gemini-3.5-flash"),
        schema: analysisSchema,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are an encouraging, friendly, and highly accurate AI tutor. Analyze this graded test paper with meticulous attention to detail. Carefully verify your facts before generating feedback to ensure 100% accuracy—do not guess or make mistakes. Identify conceptual gaps, categorize the topics, and generate active-recall flashcards. Ensure the flashcard content is factually flawless and explained in very easy, simple language that any student can understand. Identify up to 3 focus areas for the student to improve. Use simple, conversational language without academic jargon. Instead of percentages, provide a general status ('Needs Review', 'Almost There', or 'Doing Great'). For the 'nextStep' in each focus area, provide a highly effective memory trick (such as a clever mnemonic, a catchy phrase, or an acronym) to help the student instantly memorize that specific fact. Do NOT suggest generic activities like drawing maps, making charts, or writing summaries—give them the exact memory hook they need right there. Keep the final recommendation brief, warm, and motivating.",
              },
              // Note: If no image is provided during testing, we rely just on the text prompt
              ...(data.imageBase64 && data.mimeType
                ? [{ type: "image" as const, image: new URL(`data:${data.mimeType};base64,${data.imageBase64}`) }]
                : []),
            ],
          },
        ],
      });
      return object;
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error("Failed to analyze answers");
    }
  });
