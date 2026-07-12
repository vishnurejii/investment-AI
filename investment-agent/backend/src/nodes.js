import { getLLM, askForJSON } from "./services/llm.js";
import { webSearch } from "./services/search.js";

// Create one shared LLM instance used by all nodes
const llm = getLLM({ temperature: 0.2 });

// If any node fails, we set state.error.
// This helper checks that so later nodes can skip themselves.
function hasError(state) {
  return Boolean(state.error);
}

// Step 1: Get a basic company overview (who they are, what they do)
export async function researchNode(state) {
  if (hasError(state)) return {};

  try {
    const searchResults = await webSearch(
      `${state.company} company overview business model CEO industry headquarters`
    );

    const data = await askForJSON(
      llm,
      `You are an equity research analyst. Return ONLY valid JSON with no markdown, matching exactly:
{"companyName": string, "industry": string, "ceo": string, "businessModel": string, "founded": string, "headquarters": string, "summary": string}
If web search context is unavailable, use your general knowledge and mention it in "summary".`,
      `Company: ${state.company}\n\nWeb search context:\n${searchResults || "(no live search available)"}`
    );

    return { overview: data };
  } catch (err) {
    return { error: `researchNode failed: ${err.message}` };
  }
}

// Step 2: Pull financial numbers — revenue, profit, market cap
export async function financialNode(state) {
  if (hasError(state)) return {};

  try {
    const searchResults = await webSearch(
      `${state.company} revenue net income profit margin market capitalization financial results latest`
    );

    const data = await askForJSON(
      llm,
      `You are a financial analyst. Return ONLY valid JSON matching exactly:
{"revenue": string, "netIncome": string, "marketCap": string, "revenueGrowthTrend": string, "profitabilityTrend": string, "summary": string}
Use the most recent figures you know. If exact data isn't available, give an estimate and say so.`,
      `Company: ${state.company}\n\nWeb search context:\n${searchResults || "(no live search available)"}`
    );

    return { financials: data };
  } catch (err) {
    return { error: `financialNode failed: ${err.message}` };
  }
}

// Step 3: Check recent news and figure out if sentiment is positive, neutral, or negative
export async function newsNode(state) {
  if (hasError(state)) return {};

  try {
    const searchResults = await webSearch(`${state.company} latest news 2026`);

    const data = await askForJSON(
      llm,
      `You are a markets news analyst. Return ONLY valid JSON matching exactly:
{"headlines": [string], "sentiment": "positive"|"neutral"|"negative", "summary": string}
"headlines" should be 3-5 short bullet-style items.`,
      `Company: ${state.company}\n\nWeb search context:\n${searchResults || "(no live search available)"}`
    );

    return { news: data };
  } catch (err) {
    return { error: `newsNode failed: ${err.message}` };
  }
}

// Step 4: Find the main competitors and where this company stands vs them
export async function competitorNode(state) {
  if (hasError(state)) return {};

  try {
    const searchResults = await webSearch(`${state.company} main competitors market share`);

    const data = await askForJSON(
      llm,
      `You are a competitive-strategy analyst. Return ONLY valid JSON matching exactly:
{"competitors": [string], "positioning": string, "summary": string}
"competitors" should list 2-5 key rivals.`,
      `Company: ${state.company}\n\nWeb search context:\n${searchResults || "(no live search available)"}`
    );

    return { competitors: data };
  } catch (err) {
    return { error: `competitorNode failed: ${err.message}` };
  }
}

// Step 5: Identify risks and opportunities based on everything gathered so far
export async function riskNode(state) {
  if (hasError(state)) return {};

  try {
    // This node uses data from previous nodes — no extra web search needed
    const context = `Company: ${state.company}
Overview: ${JSON.stringify(state.overview)}
Financials: ${JSON.stringify(state.financials)}
News: ${JSON.stringify(state.news)}
Competitors: ${JSON.stringify(state.competitors)}`;

    const data = await askForJSON(
      llm,
      `You are a risk analyst. Return ONLY valid JSON matching exactly:
{"risks": [string], "opportunities": [string], "summary": string}
"risks" and "opportunities" should each have 3-5 concise bullet items based on the context provided.`,
      context
    );

    return { risks: data };
  } catch (err) {
    return { error: `riskNode failed: ${err.message}` };
  }
}

// Step 6: Make the final call — INVEST or PASS — with a confidence score and reasoning
export async function decisionNode(state) {
  if (hasError(state)) return {};

  try {
    const context = `Company: ${state.company}
Overview: ${JSON.stringify(state.overview)}
Financials: ${JSON.stringify(state.financials)}
News: ${JSON.stringify(state.news)}
Competitors: ${JSON.stringify(state.competitors)}
Risks & Opportunities: ${JSON.stringify(state.risks)}`;

    const data = await askForJSON(
      llm,
      `You are the lead portfolio manager. Read all the research below and return ONLY valid JSON matching exactly:
{"decision": "INVEST"|"PASS", "confidence": number, "pros": [string], "cons": [string], "reasoning": string}
"confidence" is 0-100. Keep "reasoning" to 2-4 sentences.`,
      context
    );

    return { decision: data };
  } catch (err) {
    return { error: `decisionNode failed: ${err.message}` };
  }
}
