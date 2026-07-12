export default function CompanyForm({ value, onChange, onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!loading && value.trim()) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">

      {/* Input field with a "$" prefix */}
      <div className="relative flex-1">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          $
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tesla, Apple, TCS…"
          className="w-full rounded-md pl-9 pr-4 py-3 font-mono focus:outline-none transition-colors"
          style={{
            backgroundColor: "var(--color-panel)",
            border: "1px solid var(--color-line)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-6 py-3 rounded-md font-body font-medium transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#D9A441", color: "#0B0F14" }}
      >
        {loading ? "Analyzing…" : "Run Analysis"}
      </button>

    </form>
  );
}
