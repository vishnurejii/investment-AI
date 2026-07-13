import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import {
  gatherDataNode,
  riskNode,
  decisionNode,
} from "./nodes.js";

// This builds the agent graph — basically a pipeline where each step
// feeds its output into the next one.
//
// The order is:
//   gatherData (parallel) → risk → decision
//
// If any step fails (sets state.error), the rest skip themselves
// so we get a clean error instead of a broken partial result.

export function buildGraph() {
  const graph = new StateGraph(AgentState)
    .addNode("gatherDataStep", gatherDataNode)
    .addNode("riskStep", riskNode)
    .addNode("decisionStep", decisionNode)
    .addEdge(START, "gatherDataStep")
    .addEdge("gatherDataStep", "riskStep")
    .addEdge("riskStep", "decisionStep")
    .addEdge("decisionStep", END);

  return graph.compile();
}
