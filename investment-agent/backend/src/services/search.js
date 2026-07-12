import "dotenv/config";
import axios from "axios";

// This runs a Tavily web search and returns the results as a plain text string.
// If there's no TAVILY_API_KEY in .env, it returns null and the nodes
// just fall back to the LLM's own training knowledge.
export async function webSearch(query, { maxResults = 5 } = {}) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) return null; // no key = skip search, no crash

  try {
    const { data } = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: maxResults,
        include_answer: true,
      },
      { timeout: 15000 }
    );

    // Build a simple text summary from the results
    const parts = [];
    if (data.answer) parts.push(`Summary: ${data.answer}`);

    for (const result of data.results || []) {
      parts.push(`- [${result.title}] ${result.content} (source: ${result.url})`);
    }

    return parts.join("\n");
  } catch (err) {
    console.error("Tavily search failed:", err.message);
    return null; // don't crash the whole request if search fails
  }
}
