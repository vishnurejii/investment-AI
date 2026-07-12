# AI Investment Research Agent

## 📖 Overview
The **AI Investment Research Agent** is a full-stack web application designed to act as your personal AI-driven financial analyst. You simply type in the name of a company (e.g., "Apple", "Tesla"), and the agent performs a deep-dive research analysis across six distinct steps. 

It evaluates the company's financials, analyzes recent news sentiment, identifies key competitors, flags potential risks, and ultimately provides a final **INVEST** or **PASS** recommendation complete with a confidence score and detailed reasoning. 

## 🚀 How to Run It

### Prerequisites
- Node.js installed (v18+)
- An API key for **OpenAI** (or Google Gemini). Note: The dual-LLM fallback logic requires at least one working API key with active billing/quota.

### Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and add your OpenAI API key:
   ```env
   LLM_PROVIDER=openai
   OPENAI_API_KEY=sk-your-openai-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   # Optional: Add GEMINI_API_KEY for automatic fallback support
   PORT=3001
   ```
4. Install dependencies and run the server:
   ```bash
   npm install
   npm run dev
   ```
   *The backend will start on `http://localhost:3001`.*

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and run the development server:
   ```bash
   npm install
   npm run dev
   ```
   *The UI will start on `http://localhost:5173`. Open this URL in your browser!*

*(Note: For local development, VITE_API_URL should remain blank so Vite's proxy automatically routes `/api/analyze` to `localhost:3001`)*.

---

## 🏗 How It Works (Approach and Architecture)

The application is built on a modern **React + Vite** frontend and an **Express.js** backend, powered by **LangGraph.js** for agentic reasoning.

### The LangGraph Agent Pipeline
Instead of feeding a massive, overwhelming prompt to a single LLM call (which often results in hallucinations or missed instructions), the backend breaks the research process into a structured, sequential **State Graph** using LangGraph:

1. **Research Node:** Gathers a high-level overview of the company, its CEO, industry, and core business model.
2. **Financial Node:** Analyzes estimated revenue, net income, market cap, and growth trends.
3. **News Node:** Evaluates recent market sentiment based on recent developments or headlines.
4. **Competitor Node:** Identifies key rivals and the company's competitive positioning.
5. **Risk Node:** Synthesizes the data from steps 1-4 to identify primary risks and opportunities.
6. **Decision Node:** Acts as the "Portfolio Manager", evaluating all aggregated data to make a final, well-reasoned "Invest" or "Pass" decision.

Each node focuses on a specific micro-task, appending its structured JSON output to a shared `AgentState` object. If any node fails, the graph halts and safely returns the error.

### Dual-LLM High Availability
To ensure reliability, I built a custom LLM invocation wrapper (`askForJSON` in `llm.js`). It attempts to parse the LLM's response into clean JSON. Crucially, if the primary LLM (e.g., OpenAI) throws a `429 Rate Limit` or Quota error, the system automatically catches it and falls back to a secondary provider (e.g., Gemini) to complete the request seamlessly.

---

## ⚖️ Key Decisions & Trade-offs

- **LangGraph over raw LLM calls:** I chose LangGraph to manage state transitions because it makes the pipeline deterministic and highly observable. The trade-off is slightly more boilerplate code (defining State schemas and Nodes) compared to a simple LangChain chain, but it provides much better reliability for a 6-step process.
- **LLM-generated Financials vs. External APIs:** For this MVP, the agent relies entirely on the LLM's internal knowledge (and LangChain search tools when configured) to estimate financials. *Trade-off:* The data might be slightly outdated or hallucinated depending on the model's training cutoff. *Why:* I left out heavy third-party financial APIs (like Alpha Vantage or Yahoo Finance) to keep the setup simple and free of paywalls for anyone running the project. 
- **Sequential Execution:** The LangGraph pipeline runs sequentially. *Trade-off:* It takes longer (approx 15-20 seconds for all 6 steps). I left out parallel execution (e.g., running News and Financials at the same time) because LangGraph's fan-in logic adds complexity, and I wanted to keep the graph structure straightforward and easy to debug.
- **Tailwind CSS vs Component Libraries:** I chose raw Tailwind CSS with native CSS Variables for a seamless Dark/Light mode, avoiding heavy component libraries like Material UI to keep the bundle size small and the design hyper-customizable.

---

## 📊 Example Runs

### Example 1: Apple Inc. (AAPL)
- **Overview:** Tech giant, consumer electronics, software, and services.
- **Financials:** High profitability, ~$3T+ Market Cap, strong service revenue growth.
- **News Sentiment:** Positive (focus on AI integrations in iOS, steady hardware sales).
- **Risks:** Heavy reliance on iPhone sales, regulatory scrutiny in EU, supply chain dependencies in Asia.
- **Decision:** **INVEST (85% Confidence)**
- **Reasoning:** Despite regulatory headwinds, Apple's massive cash reserves, unshakeable brand loyalty, and growing high-margin services sector make it a highly resilient long-term holding.

### Example 2: Peloton (PTON)
- **Overview:** Interactive fitness platform and connected equipment.
- **Financials:** Struggling revenue growth, consistent net losses, shrinking market cap.
- **News Sentiment:** Negative/Mixed (restructuring efforts, CEO changes).
- **Risks:** Post-pandemic demand crash, high churn rate, intense competition from cheaper alternatives.
- **Decision:** **PASS (90% Confidence)**
- **Reasoning:** The business model has struggled to adapt to a post-pandemic world. Until profitability stabilizes and subscriber growth resumes a clear upward trajectory, the downside risk remains too high.

---

## 🛠 What I Would Improve With More Time

1. **Parallel Node Execution:** I would refactor the LangGraph to execute the Financial, News, and Competitor nodes in parallel (since they do not depend on each other). This would drastically reduce the total response time from ~15 seconds to ~5 seconds.
2. **Real-time Financial API Integration:** I would integrate a service like Polygon.io or Yahoo Finance into the `Financial Node` to feed the LLM hard, real-time metrics (P/E ratio, exact quarterly revenue) rather than relying on the LLM's internal knowledge.
3. **Caching Layer:** I would add Redis to cache reports for 24 hours. If a user searches "Tesla" and someone else searches it an hour later, it should return instantly instead of burning LLM tokens.
4. **Streaming UI:** Implementing Server-Sent Events (SSE) so the UI updates step-by-step (e.g., "Analyzing Financials...", then "Reading News...") instead of a static loading spinner.

---

## 🎁 BONUS: LLM Chat Session Transcript

As mandated for the bonus points, this entire project was built in tight collaboration with an Agentic LLM (Google DeepMind's Antigravity system). 

To provide full insight into the thought process, debugging steps (including resolving complex Vercel deployment timeouts and API quota issues), and architecture decisions, I have included the raw JSONL transcript of our conversation.

👉 You can find the complete LLM chat logs in the root directory of this repository: **`LLM_CHAT_LOGS.jsonl`**
