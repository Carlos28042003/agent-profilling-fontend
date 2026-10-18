# agentic-profiling — frontend

The web interface of **agentic-profiling**, a study of where the time goes when an LLM
agent runs and how much of each prompt is repeated work.

- **Results:** the experiments' key numbers and charts (time split, prompt vs. cache per
  step, context growth, latency CDF, serving comparison).
- **Ask the agent:** type a question and watch the agent work live, step by step, with
  timings, tokens and cache hits. Needs the backend running locally.
- **About:** what the project measures and how to run it.

The agent, the experiments and the data live in the
**[backend repository](https://github.com/Carlos28042003/agent-profilling)**.

Built with **React 19**, **Tailwind CSS 4** and **Vite 8**. No runtime dependencies besides
React; charts are plain SVG.

---

## Setup

The two repositories sit side by side in one folder:

```
agentic-profiling/
├── backend/     Python: agent, experiments, API (separate repository)
└── frontend/    this repository
```

Requirements: [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload on http://localhost:5173. Requests to `/api` go to the backend on http://localhost:8000 |
| `npm run build` | Production build into `docs/` (served by GitHub Pages and by the backend) |
| `npm run preview` | Serve the production build locally |
| `npm run sync-data` | Copy the experiment data from the backend (`../backend/results/data.json`) into `src/data.json`. Set `BACKEND_DIR` if the backend is elsewhere |

## Common tasks

**See the site with the live agent** (one terminal):

```bash
npm run build
cd ../backend && uv run agentic-ui        # http://localhost:8000 serves docs/ + the API
```

**Develop the UI** (two terminals):

```bash
# terminal 1, in ../backend
uv run agentic-ui --no-browser
# terminal 2, here
npm run dev                                # http://localhost:5173
```

**Show new results:**

```bash
# in ../backend
uv run agentic-export <name> traces/<experiment>/* --title "..." --description "..."
# here
npm run sync-data
npm run build
git add -A && git commit -m "Results: <name>" && git push
```

## Deploying to GitHub Pages

`docs/` is committed on purpose. In the GitHub repository: **Settings → Pages → Build and
deployment → Deploy from a branch → `main` / `docs`**. The site is then published at
`https://<user>.github.io/<repository>/`. Paths are relative (`base: "./"`), so it works
under any repository name. On GitHub Pages the "Ask the agent" tab shows "local only",
because it needs the Python backend and Ollama.

## Project layout

```
src/
  main.jsx              entry point (theme from ?theme=light|dark)
  App.jsx               header, tabs (linkable: #results, #ask, #about), backend detection
  index.css             Tailwind + color tokens (validated palette, light and dark)
  data.json             experiment data from the backend — do not edit by hand
  lib/format.js         number formatting, series colors
  components/ui.jsx     Stat, Legend, Tooltip, Section
  components/charts.jsx StepTokensChart, TimeSplit, TimeBreakdown, LineChart, ThroughputBars
  components/tables.jsx RunsTable, CompareTable, TaskGrid
  pages/Results.jsx     experiments view
  pages/Ask.jsx         live agent (Server-Sent Events from /api/ask)
  pages/About.jsx       project description and run instructions
scripts/sync-data.mjs   copies results/data.json from the backend
public/.nojekyll        tells GitHub Pages to serve files as they are
docs/                   production build (committed for GitHub Pages)
```

## How it talks to the backend

| Endpoint | Used by | What it returns |
|---|---|---|
| `GET /api/health` | `App.jsx` | `{ ok, configs: [{ name, model }] }`; if it fails, the site runs in static mode |
| `GET /api/ask?question=...&config=...` | `Ask.jsx` | Server-Sent Events: `start`, one `step` per agent step, then `done` (or `error`) |

Results do not need the backend at run time: they are bundled from `src/data.json`.
