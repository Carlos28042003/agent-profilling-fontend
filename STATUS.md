# Frontend status

Last updated: 18 Oct 2026. The experiments and their progress are tracked in the backend
repository (`../backend/STATUS.md`).

| Area | State |
|---|---|
| React 19 + Tailwind CSS 4 + Vite 8 project, separate repository | ✅ Done |
| Results tab (key numbers, charts, tables) | ✅ Done; shows Week 1 data, will show Weeks 2-5 after export |
| Ask the agent tab (live, Server-Sent Events) | ✅ Done; tested end to end with the backend |
| About tab | ✅ Done |
| GitHub Pages deployment from `docs/` | ⏳ Create the GitHub repository and enable Pages |
| Final results (Weeks 2-5) on the page | ⏳ After the experiments |

---

## 1. How to run

PowerShell; copy only the commands.

### First time

```powershell
cd C:\dev\agentic-profiling\frontend
npm install
npm run sync-data        # copies ..\backend\results\data.json into src\data.json
npm run build            # builds the site into docs\
```

### See the site with the live agent

```powershell
cd C:\dev\agentic-profiling\backend
uv run agentic-ui        # http://localhost:8000 = frontend\docs + the API
```

### Develop with hot reload (two terminals)

```powershell
# Terminal 1
cd C:\dev\agentic-profiling\backend
uv run agentic-ui --no-browser

# Terminal 2
cd C:\dev\agentic-profiling\frontend
npm run dev              # http://localhost:5173
```

Edit files in `src\`; the browser updates on save. Finish with `npm run build`.

### Update the results

```powershell
cd C:\dev\agentic-profiling\backend
uv run agentic-export <name> traces/<experiment>/* --title "..." --description "..."
cd ..\frontend
npm run sync-data
npm run build
git add -A
git commit -m "Results: <name>"
git push
```

---

## 2. Done

| Item | File | Status |
|---|---|---|
| Vite config: React + Tailwind plugins, relative paths (`base: "./"`), build into `docs/`, `/api` proxy to the backend in dev | `vite.config.js` | ✅ |
| Color tokens from a validated categorical palette, separate light and dark steps; `?theme=` override | `src/index.css`, `src/main.jsx` | ✅ |
| Tabs with links (`#results`, `#ask`, `#about`); backend detection via `/api/health` | `src/App.jsx` | ✅ |
| Results: experiment selector, key numbers, prompt-vs-cache per step, time split (prefill/decode/tools/overhead), context growth with 25th-75th band, latency CDF, serving comparison with throughput bars, runs table, per-task grid (≤ 20 tasks) | `src/pages/Results.jsx`, `src/components/` | ✅ |
| Charts in plain SVG with hover tooltips and legends | `src/components/charts.jsx` | ✅ |
| Ask: question, model choice (defaults to Ollama), live step cards (thought, tool, input, observation, TTFT, tokens, cache), running timer, answer summary | `src/pages/Ask.jsx` | ✅ |
| `npm run sync-data` to bring data from the backend | `scripts/sync-data.mjs` | ✅ |
| `.gitignore` (node_modules, caches, env files), `.gitattributes` (LF), `.nojekyll` for Pages | — | ✅ |
| Checked: light and dark mode, phone width (375 px), build served by the backend, live question end to end | — | ✅ |

---

## 3. Publishing the repository (to do)

1. On GitHub: **New repository**, for example `agentic-profiling-frontend` (empty: no README,
   no .gitignore).
2. Here:
   ```powershell
   cd C:\dev\agentic-profiling\frontend
   git remote add origin https://github.com/Carlos28042003/agentic-profiling-frontend.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Deploy from a branch → `main` / `docs`**.
4. If you choose another repository name, update the link in the backend README.

---

## 4. Known issues

| # | Issue | What to do |
|---|---|---|
| 1 | After new results, the page shows old numbers until rebuilt | `npm run sync-data && npm run build` |
| 2 | On GitHub Pages the "Ask the agent" tab cannot work (no Python backend there) | Expected: it shows "local only" with instructions |
| 3 | Charts show at most 3 series per chart (palette limit for clear colors) | Fine for 2 workloads; for more runs use the tables |
| 4 | The bundle is ~80 KB gzipped, mostly React | Acceptable for a results page |
