import { Annotation } from "@langchain/langgraph";

// LangGraph needs each field to have a "reducer" and a "default".
// reducer: (_, newValue) => newValue  just means "always use the latest value"
// default: () => null  means the field starts as null until a node fills it in
//
// We wrap that in a helper so we don't repeat the same thing 8 times.
function field(startValue = null) {
  return Annotation({
    reducer: (_, newValue) => newValue,
    default: () => startValue,
  });
}

// This is the shared data object that flows through every step of the pipeline.
// Each step (node) reads what it needs and adds its own result.
//
// Flow:  research → financials → news → competitors → risk → decision
//
// company     — the name we're researching (e.g. "Tesla")
// overview    — filled by researchNode (who they are, what they do)
// financials  — filled by financialNode (revenue, profit, market cap)
// news        — filled by newsNode (recent headlines + sentiment)
// competitors — filled by competitorNode (key rivals, positioning)
// risks       — filled by riskNode (risks + opportunities)
// decision    — filled by decisionNode (INVEST or PASS + reasoning)
// error       — set by any node if something goes wrong; later nodes skip when this is set

export const AgentState = Annotation.Root({
  company:     field(""),
  overview:    field(),
  financials:  field(),
  news:        field(),
  competitors: field(),
  risks:       field(),
  decision:    field(),
  error:       field(),
});
