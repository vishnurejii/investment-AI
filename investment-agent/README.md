# AI Investment Research Agent

Hey there! I built this web app to explore how to use LangGraph.js for building structured reasoning pipelines. 

You type in a company name (like "Tesla" or "Apple"), and a backend agent researches it across six different steps. It pulls financial data, reads recent news, identifies competitors, and weighs the risks before handing back a final **INVEST or PASS** recommendation with a confidence score.

---

## How to run it locally

### Prerequisites
- Node.js installed (v18+)
- An API key for either Google Gemini or OpenAI.

### Backend Setup
1. Open a terminal and go to the `backend` folder.
2. Copy `.env.example` to `.env`.
3. Open `.env` and add your API key (I defaulted it to use `gemini-2.0-flash-lite` since it has a good free tier, but you can swap it to OpenAI if you prefer).
4. Run:
```bash
npm install
npm run dev
```
The backend will start on `http://localhost:3001`.

### Frontend Setup
1. Open a new terminal and go to the `frontend` folder.
2. Run:
```bash
npm install
npm run dev
```
The UI will start on `http://localhost:5173`. Open that in your browser!

---

## How I designed the architecture

I decided to split the application into a React frontend and an Express backend. 

### The Graph Pipeline
Instead of just sending one massive prompt to the LLM (which usually gets confused or misses details), I used **LangGraph.js** to build a 6-step sequential pipeline:

1. **Research** — Gets a high-level overview of the company, CEO, industry, etc.
2. **Financials** — Estimates revenue, profit, and market cap.
3. **News** — Checks recent headlines and determines the overall sentiment.
4. **Competitors** — Identifies key rivals in the space.
5. **Risk** — Looks at all the data from steps 1-4 to figure out risks and opportunities.
6. **Decision** — The final step acts as a portfolio manager, weighing everything to make a final call.

Each step in `nodes.js` just does its one specific job and adds its data to a shared `state.js` object. I built a helper function `askForJSON` in the backend so that the LLM always returns clean JSON data that the frontend can easily render.

### The Frontend
I kept the frontend pretty simple—just plain React and Tailwind CSS. No Redux or heavy state management libraries needed since it's just one main view. I also added a dark/light mode toggle using native CSS variables (`--color-bg`, etc.) in `index.css` so the whole theme switches smoothly without extra JavaScript overhead. 

There's also a "Download Report" button that grabs the final JSON result and formats it into a neat `.txt` file for offline reading.

---

## Things I learned & future improvements

If I had more time to expand this, here's what I'd tackle next:

- **Parallel Processing:** Right now, the financial, news, and competitor nodes run one after another. Since they don't depend on each other, I could run them in parallel using `Promise.all` to speed up the total loading time.
- **Real Financial APIs:** Currently, it relies on LLM knowledge (and optional web search) for financials. It would be much more accurate to plug in a real API like Alpha Vantage or Yahoo Finance for the hard numbers.
- **Caching:** Adding a simple Redis cache keyed by the company name and current date would make repeat searches instant.

---

*Note: This is a personal project built for demonstration and learning purposes. The AI's output is just for fun and definitely not actual financial advice!*
