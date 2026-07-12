// The six analysis steps shown while the agent is working
const STAGES = ["RESEARCH", "FINANCIALS", "NEWS", "COMPETITORS", "RISK", "DECISION"];

export default function Loader({ company }) {
  return (
    <div
      className="w-full rounded-md p-6 font-mono text-sm"
      style={{
        border: "1px solid var(--color-line)",
        backgroundColor: "var(--color-panel)",
      }}
    >
      {/* Pulsing dot + company name */}
      <div className="flex items-center gap-2 mb-4" style={{ color: "#D9A441" }}>
        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#D9A441" }} />
        SCANNING {company.toUpperCase()}
      </div>

      {/* Each stage label pulses in sequence */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((stage, i) => (
          <span
            key={stage}
            className="px-2.5 py-1 rounded"
            style={{
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              animation: `pulseStage 1.8s ${i * 0.25}s infinite`,
            }}
          >
            {stage}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes pulseStage {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; color: #D9A441; border-color: #D9A441; }
        }
      `}</style>
    </div>
  );
}
