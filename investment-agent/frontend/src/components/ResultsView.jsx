import SectionCard from "./SectionCard.jsx";
import DecisionStamp from "./DecisionStamp.jsx";

export default function ResultsView({ result }) {
  const { overview, financials, news, competitors, risks, decision } = result;

  // Pick a color for the news sentiment badge
  function sentimentColor(sentiment) {
    if (sentiment === "positive") return { background: "rgba(53,208,127,0.2)", color: "#35D07F" };
    if (sentiment === "negative") return { background: "rgba(255,107,74,0.2)", color: "#FF6B4A" };
    return { background: "var(--color-line)", color: "var(--color-muted)" };
  }

  return (
    <div className="space-y-4">

      {/* Section 1: Company Overview */}
      <SectionCard index={1} label="OVERVIEW">
        <h3 className="font-display text-xl" style={{ color: "var(--color-text)" }}>
          {overview?.companyName}
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs mt-2 mb-3" style={{ color: "var(--color-muted)" }}>
          <span>INDUSTRY · {overview?.industry}</span>
          <span>CEO · {overview?.ceo}</span>
          <span>FOUNDED · {overview?.founded}</span>
          <span>HQ · {overview?.headquarters}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)", opacity: 0.85 }}>
          {overview?.businessModel}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)", opacity: 0.65 }}>
          {overview?.summary}
        </p>
      </SectionCard>

      {/* Section 2: Financial Numbers */}
      <SectionCard index={2} label="FINANCIALS">
        <div className="grid sm:grid-cols-3 gap-4 font-mono text-sm mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--color-muted)" }}>REVENUE</div>
            <div style={{ color: "var(--color-text)" }}>{financials?.revenue}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--color-muted)" }}>NET INCOME</div>
            <div style={{ color: "var(--color-text)" }}>{financials?.netIncome}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--color-muted)" }}>MARKET CAP</div>
            <div style={{ color: "var(--color-text)" }}>{financials?.marketCap}</div>
          </div>
        </div>
        <p className="text-sm" style={{ color: "var(--color-text)", opacity: 0.85 }}>
          <span style={{ color: "var(--color-muted)" }}>Growth: </span>
          {financials?.revenueGrowthTrend}
        </p>
        <p className="text-sm" style={{ color: "var(--color-text)", opacity: 0.85 }}>
          <span style={{ color: "var(--color-muted)" }}>Profitability: </span>
          {financials?.profitabilityTrend}
        </p>
      </SectionCard>

      {/* Section 3: News & Sentiment */}
      <SectionCard index={3} label="NEWS">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs" style={{ color: "var(--color-muted)" }}>SENTIMENT</span>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={sentimentColor(news?.sentiment)}
          >
            {news?.sentiment?.toUpperCase()}
          </span>
        </div>
        <ul className="space-y-1.5">
          {(news?.headlines || []).map((headline, i) => (
            <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-text)", opacity: 0.85 }}>
              <span style={{ color: "#D9A441" }}>›</span>
              {headline}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Section 4: Competitors */}
      <SectionCard index={4} label="COMPETITORS">
        <div className="flex flex-wrap gap-2 mb-3">
          {(competitors?.competitors || []).map((name, i) => (
            <span
              key={i}
              className="font-mono text-xs px-2.5 py-1 rounded"
              style={{
                border: "1px solid var(--color-line)",
                color: "var(--color-text)",
                opacity: 0.85,
              }}
            >
              {name}
            </span>
          ))}
        </div>
        <p className="text-sm" style={{ color: "var(--color-text)", opacity: 0.85 }}>
          {competitors?.positioning}
        </p>
      </SectionCard>

      {/* Section 5: Risks & Opportunities */}
      <SectionCard index={5} label="RISK">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="font-mono text-xs mb-2" style={{ color: "#FF6B4A" }}>RISKS</div>
            <ul className="space-y-1.5">
              {(risks?.risks || []).map((item, i) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-text)", opacity: 0.85 }}>
                  <span style={{ color: "#FF6B4A" }}>–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs mb-2" style={{ color: "#35D07F" }}>OPPORTUNITIES</div>
            <ul className="space-y-1.5">
              {(risks?.opportunities || []).map((item, i) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-text)", opacity: 0.85 }}>
                  <span style={{ color: "#35D07F" }}>+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Section 6: Final Decision */}
      <div>
        <div className="font-mono text-xs mb-2 tracking-widest" style={{ color: "#D9A441" }}>
          06 · FINAL DECISION
        </div>
        <DecisionStamp decision={decision} />
      </div>

    </div>
  );
}
