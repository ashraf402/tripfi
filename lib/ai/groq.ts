import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error(
    "[Groq] GROQ_API_KEY is not set in .env. " +
      "Get your key at console.groq.com",
  );
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fast model for intent detection
export const GROQ_MODEL = "llama-3.3-70b-versatile";
