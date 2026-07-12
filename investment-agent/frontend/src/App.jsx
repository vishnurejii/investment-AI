import { useState } from "react";
import CompanyForm from "./components/CompanyForm.jsx";
import Loader from "./components/Loader.jsx";
import ResultsView from "./components/ResultsView.jsx";

export default function App() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(true);

  // Call the backend API with the company name
  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // In production, VITE_API_URL points to the deployed backend.
      // Locally, it's empty so the Vite proxy handles /api/* as usual.
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    }

    setLoading(false);
  }

  // Download the full analysis as a text file
  function downloadReport() {
    if (!result) return;

    const d = result.decision || {};
    const o = result.overview || {};
    const f = result.financials || {};
    const n = result.news || {};
    const c = result.competitors || {};
    const r = result.risks || {};

    const lines = [
      `Investment Research Report — ${result.company}`,
      "=".repeat(50),
      "",
      "OVERVIEW",
      `Company: ${o.companyName}`,
      `Industry: ${o.industry}`,
      `CEO: ${o.ceo}`,
      `Founded: ${o.founded}`,
      `HQ: ${o.headquarters}`,
      `Business Model: ${o.businessModel}`,
      `Summary: ${o.summary}`,
      "",
      "FINANCIALS",
      `Revenue: ${f.revenue}`,
      `Net Income: ${f.netIncome}`,
      `Market Cap: ${f.marketCap}`,
      `Revenue Growth: ${f.revenueGrowthTrend}`,
      `Profitability: ${f.profitabilityTrend}`,
      "",
      "NEWS",
      `Sentiment: ${n.sentiment}`,
      "Headlines:",
      ...(n.headlines || []).map((h) => `  - ${h}`),
      "",
      "COMPETITORS",
      `Key Rivals: ${(c.competitors || []).join(", ")}`,
      `Positioning: ${c.positioning}`,
      "",
      "RISKS",
      "Risks:",
      ...(r.risks || []).map((x) => `  - ${x}`),
      "Opportunities:",
      ...(r.opportunities || []).map((x) => `  + ${x}`),
      "",
      "FINAL DECISION",
      `Decision: ${d.decision}`,
      `Confidence: ${d.confidence}%`,
      `Reasoning: ${d.reasoning}`,
      "Pros:",
      ...(d.pros || []).map((x) => `  + ${x}`),
      "Cons:",
      ...(d.cons || []).map((x) => `  - ${x}`),
    ];

    const text = lines.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.company}-research-report.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    // "dark" class here triggers the .dark CSS variables in index.css
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen theme-bg theme-text font-body transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">

          {/* Header */}
          <header className="flex items-start justify-between mb-10">
            <div>
              <h1 className="font-display font-semibold text-3xl md:text-4xl leading-tight" style={{ color: "var(--color-text)" }}>
                AI Investment
                <br />
                Research Agent
              </h1>
              <p className="text-sm mt-3 max-w-md" style={{ color: "var(--color-muted)" }}>
                Enter a company name. The agent researches it across six steps and
                gives you an invest or pass recommendation with reasoning.
              </p>
            </div>

            {/* Light / Dark toggle button */}
            <button
              onClick={() => setDark(!dark)}
              className="font-mono text-xs px-3 py-1.5 rounded theme-border theme-muted
                         hover:text-paper hover:border-gold transition-colors shrink-0"
              style={{
                border: "1px solid var(--color-line)",
                color: "var(--color-muted)",
              }}
            >
              {dark ? "LIGHT" : "DARK"}
            </button>
          </header>

          {/* Search form */}
          <div className="mb-8">
            <CompanyForm
              value={company}
              onChange={setCompany}
              onSubmit={analyze}
              loading={loading}
              dark={dark}
            />
          </div>

          {/* Loading state */}
          {loading && <Loader company={company} dark={dark} />}

          {/* Error message */}
          {error && (
            <div
              className="rounded-md p-4 font-mono text-sm"
              style={{
                border: "1px solid rgba(255,107,74,0.4)",
                backgroundColor: "rgba(255,107,74,0.1)",
                color: "#FF6B4A",
              }}
            >
              Error: {error}
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <>
              {/* Download button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={downloadReport}
                  className="font-mono text-xs px-4 py-2 rounded transition-colors"
                  style={{
                    border: "1px solid #D9A441",
                    color: "#D9A441",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#D9A441";
                    e.target.style.color = "#0B0F14";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#D9A441";
                  }}
                >
                  ↓ Download Report
                </button>
              </div>
              <ResultsView result={result} dark={dark} />
            </>
          )}

          {/* Empty state — shown before any search */}
          {!result && !loading && !error && (
            <div
              className="rounded-md p-10 text-center font-mono text-xs"
              style={{
                border: "1px dashed var(--color-line)",
                color: "var(--color-muted)",
              }}
            >
              No analysis yet — enter a company above
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
