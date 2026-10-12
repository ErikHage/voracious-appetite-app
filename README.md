# voracious-appetite-app

## Running locally

Run these from Git Bash. `recipes-service` must be checked out next to this project at `../recipes-service`, with a `.env` that has `GITHUB_API_TOKEN` in it.

```sh
./start-voracious-appetite.sh   # starts recipes-service (port 3000) and the app (port 5175)
./stop-voracious-appetite.sh    # stops both
```

The app is served at http://localhost:5175/apps/voracious-appetite/. Logs are written to `.run/`.
