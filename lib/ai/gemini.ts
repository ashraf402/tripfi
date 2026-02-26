import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_KEY) {
  throw new Error(
    "[Gemini] GOOGLE_AI_KEY is not set in .env. " +
      "Get your key at aistudio.google.com",
  );
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// Deep reasoning model for trip planning
export const gemini = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const GEMINI_MODEL = "gemini-2.5-flash";
