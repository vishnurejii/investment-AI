export default function SectionCard({ index, label, children }) {
  return (
    <div
      className="flex rounded-md overflow-hidden"
      style={{ border: "1px solid var(--color-line)" }}
    >
      {/* Side label — the rotated number + section name */}
      <div
        className="shrink-0 w-10 flex items-center justify-center font-mono text-[11px] tracking-widest"
        style={{
          writingMode: "vertical-rl",
          borderRight: "1px solid var(--color-line)",
          backgroundColor: "var(--color-panel-light)",
          color: "var(--color-muted)",
        }}
      >
        {String(index).padStart(2, "0")} · {label}
      </div>

      {/* Main content area */}
      <div
        className="flex-1 p-5 space-y-2"
        style={{ backgroundColor: "var(--color-panel)" }}
      >
        {children}
      </div>
    </div>
  );
}
