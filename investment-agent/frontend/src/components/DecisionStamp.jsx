export default function DecisionStamp({ decision }) {
  if (!decision) return null;

  const isInvest = decision.decision === "INVEST";
  const accentColor = isInvest ? "#35D07F" : "#FF6B4A";

  return (
    <div
      className="rounded-md p-6 md:p-8"
      style={{
        border: "1px solid var(--color-line)",
        backgroundColor: "var(--color-panel)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

        {/* The big INVEST / PASS stamp */}
        <div
          className="shrink-0 self-start md:self-center rounded-lg px-6 py-3 font-display font-bold text-3xl md:text-4xl tracking-tight"
          style={{
            border: `4px solid ${accentColor}`,
            color: accentColor,
            transform: "rotate(-3deg)",
          }}
        >
          {isInvest ? "INVEST" : "PASS"}
        </div>

        {/* Confidence bar + reasoning */}
        <div className="flex-1 space-y-3">
          <div className="font-mono text-xs" style={{ color: "var(--color-muted)" }}>CONFIDENCE</div>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--color-line)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${decision.confidence ?? 0}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
            <span className="font-mono text-sm" style={{ color: accentColor }}>
              {decision.confidence ?? "—"}%
            </span>
          </div>
          <p className="leading-relaxed" style={{ color: "var(--color-text)", opacity: 0.9 }}>
            {decision.reasoning}
          </p>
        </div>
      </div>

      {/* Pros and Cons */}
      <div
        className="grid sm:grid-cols-2 gap-6 mt-6 pt-6"
        style={{ borderTop: "1px solid var(--color-line)" }}
      >
        <div>
          <div className="font-mono text-xs mb-2" style={{ color: "#35D07F" }}>PROS</div>
          <ul className="space-y-1.5">
            {(decision.pros || []).map((item, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-text)", opacity: 0.85 }}>
                <span style={{ color: "#35D07F" }}>+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs mb-2" style={{ color: "#FF6B4A" }}>CONS</div>
          <ul className="space-y-1.5">
            {(decision.cons || []).map((item, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-text)", opacity: 0.85 }}>
                <span style={{ color: "#FF6B4A" }}>–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
