import { Router } from "express";
import { buildGraph } from "./graph.js";

const router = Router();

// Build the agent graph once when the server starts.
// Every request reuses the same compiled graph.
const agent = buildGraph();

// POST /api/analyze — main endpoint
// Expects: { company: "Tesla" }
// Returns: all the research data + a final invest/pass decision
router.post("/analyze", async (req, res) => {
  const { company } = req.body || {};

  if (!company || typeof company !== "string" || !company.trim()) {
    return res.status(400).json({ error: "Please provide a company name." });
  }

  try {
    const result = await agent.invoke({ company: company.trim() });

    // If any node set an error, send it back as a 502
    if (result.error) {
      return res.status(502).json({ error: result.error });
    }

    // Send the full research result back to the frontend
    return res.json({
      company: result.company,
      overview: result.overview,
      financials: result.financials,
      news: result.news,
      competitors: result.competitors,
      risks: result.risks,
      decision: result.decision,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET /api/health — simple check to confirm the server is alive
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
