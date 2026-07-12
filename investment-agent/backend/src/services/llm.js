import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Pick the right LLM based on what's in the .env file
// Supports "openai" or "gemini"
export function getLLM({ temperature = 0.3 } = {}) {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();

  if (provider === "gemini") {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from .env");
    }
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      temperature,
    });
  }

  // Default: OpenAI
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing from .env");
  }
  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature,
  });
}

// Sends a message to the LLM and parses the response as JSON.
// The LLM is instructed to return plain JSON (no markdown fences),
// but we strip them anyway just in case.
export async function askForJSON(llm, systemPrompt, userPrompt) {
  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  // response.content is the raw text the model returned
  const raw =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Strip any markdown code fences the model might have added
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // If straight parse fails, try to grab the first {...} block in the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        // still failed, fall through
      }
    }
    throw new Error(`LLM did not return valid JSON. Raw response:\n${raw.slice(0, 500)}`);
  }
}
