import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import {
  researchNode,
  financialNode,
  newsNode,
  competitorNode,
  riskNode,
  decisionNode,
} from "./nodes.js";

// This builds the agent graph — basically a pipeline where each step
// feeds its output into the next one.
//
// The order is:
//   research → financials → news → competitors → risk → decision
//
// If any step fails (sets state.error), the rest skip themselves
// so we get a clean error instead of a broken partial result.

export function buildGraph() {
  const graph = new StateGraph(AgentState)
    .addNode("researchStep", researchNode)
    .addNode("financialStep", financialNode)
    .addNode("newsStep", newsNode)
    .addNode("competitorStep", competitorNode)
    .addNode("riskStep", riskNode)
    .addNode("decisionStep", decisionNode)
    .addEdge(START, "researchStep")
    .addEdge("researchStep", "financialStep")
    .addEdge("financialStep", "newsStep")
    .addEdge("newsStep", "competitorStep")
    .addEdge("competitorStep", "riskStep")
    .addEdge("riskStep", "decisionStep")
    .addEdge("decisionStep", END);

  return graph.compile();
}
