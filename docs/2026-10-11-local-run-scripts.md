# Local run scripts

Start and stop recipes-service and the voracious-appetite-app together for local development.

## 2026-10-11

**Goal:** one command to bring up the app against a local recipes-service, and one to shut both down.

**Files:** `start-voracious-appetite.sh` and `stop-voracious-appetite.sh` at the project root. They're bash scripts, like `recipes-service/scripts/pull-and-restart.sh`, and run in Git Bash. They're listed in the new `.dockerignore`, along with `.run`.

**How they work**
- **recipes-service** runs from `../recipes-service` with `node ./bin/server` on port 3000. Override the location with `RECIPES_SERVICE_DIR` and the port with `RECIPES_SERVICE_PORT`. It reads `GITHUB_API_TOKEN` from its own `.env`.
- **The app** runs the vite dev server on port 5175 (`--strictPort`). It sets `VITE_RECIPE_SERVICE_V0_BASE_URL` to the local service. Vite gives process env vars priority over `.env.development`, which points at production.
- **Processes run in the background,** started with `node` directly rather than `npm run`. That way each pid is the server itself. PIDs and logs go in `.run/` (git-ignored). Under Git Bash, the Windows PID is saved too, and stop uses `taskkill /T /F` to kill the process tree.
- **Start waits for real responses.** The service listens before it has loaded recipes from GitHub, and exits (code 69) if that load fails. So start waits until `/recipes` returns a non-empty list, and if the process dies it prints the end of the log and exits 1.
- If a process is already running, start skips it. If `node_modules` is missing, start runs `npm ci` first.
- Added `.gitattributes` with `*.sh text eol=lf`. With `core.autocrlf`, the scripts would otherwise check out with CRLF and bash would fail on them.

**Declined:** Docker compose. Docker isn't installed locally, and the compose files pull published images rather than running local code.

**Verification:** I ran start outside the sandbox, because this session's sandboxed network fails TLS to github.com. The service loaded 70 recipes from GitHub. A recipe's detail endpoint worked, CORS allows the app's origin, the app served its pages, and the app used `http://localhost:3000/api/recipes-service`. Stop freed both ports. Earlier sandboxed runs covered the other paths: start reports a service that exits (with the log tail), and a second start reports processes that are already running.

**Docker:** `.dockerignore` now also excludes `node_modules`. Before, the Dockerfile's `COPY . .` copied the local `node_modules` (Windows binaries, dev installs) over the one `npm install` had just built in the image.
