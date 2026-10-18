// Copy the experiment data exported by the backend into src/data.json.
//
//   npm run sync-data                      # backend repository next to this one (../backend)
//   BACKEND_DIR=/path/to/backend npm run sync-data
//
// In the backend, `uv run agentic-export ...` writes results/data.json.
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const backend = resolve(here, "..", process.env.BACKEND_DIR ?? "../backend");
const source = resolve(backend, "results", "data.json");
const target = resolve(here, "..", "src", "data.json");

if (!existsSync(source)) {
  console.error(`Not found: ${source}\nRun "uv run agentic-export ..." in the backend, or set BACKEND_DIR.`);
  process.exit(1);
}
copyFileSync(source, target);
const { experiments, updated } = JSON.parse(readFileSync(target, "utf8"));
console.log(`Copied ${experiments.length} experiments (updated ${updated}) from ${source}`);
