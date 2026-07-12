import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Create an OpenAI instance (returns null if no key is set)
function makeOpenAI(temperature) {
  if (!process.env.OPENAI_API_KEY) return null;
  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature,
  });
}

// Create a Gemini instance (returns null if no key is set)
function makeGemini(temperature) {
  if (!process.env.GEMINI_API_KEY) return null;
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
    temperature,
  });
}

// Build the primary + fallback LLM based on LLM_PROVIDER in .env
// If both keys are provided, the non-primary becomes the fallback.
export function getLLM({ temperature = 0.3 } = {}) {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();

  let primary, fallback;

  if (provider === "gemini") {
    primary = makeGemini(temperature);
    fallback = makeOpenAI(temperature);
  } else {
    primary = makeOpenAI(temperature);
    fallback = makeGemini(temperature);
  }

  // If primary key is missing, just use fallback as primary
  if (!primary && fallback) {
    primary = fallback;
    fallback = null;
  }

  return { primary, fallback };
}

// Check if an error looks like a rate limit / quota error
function isRateLimitError(err) {
  const msg = (err.message || "").toLowerCase();
  return msg.includes("429") || msg.includes("quota") || msg.includes("rate");
}

// Parse raw LLM text into a JSON object.
// Strips markdown fences and grabs the first {...} block if needed.
function parseJSON(raw) {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // If straight parse fails, try to grab the first {...} block
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

// Call the LLM and get back parsed JSON.
// If the primary model hits a rate limit and a fallback exists, retry with the fallback.
export async function askForJSON(llmPair, systemPrompt, userPrompt) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  if (!llmPair.primary) {
    throw new Error("No API key found in Vercel environment variables! Please add OPENAI_API_KEY or GEMINI_API_KEY in your Vercel project settings.");
  }

  // Try primary first
  try {
    const response = await llmPair.primary.invoke(messages);
    const raw = typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);
    return parseJSON(raw);
  } catch (err) {
    // If it's a rate limit error and we have a fallback, try the other provider
    if (isRateLimitError(err) && llmPair.fallback) {
      console.log(`Primary LLM hit rate limit, switching to fallback...`);
      const response = await llmPair.fallback.invoke(messages);
      const raw = typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
      return parseJSON(raw);
    }
    // Not a rate limit error, or no fallback — just throw
    throw err;
  }
}
