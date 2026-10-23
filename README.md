# voracious-appetite-app

## Running locally

Run these from Git Bash. `recipes-service` must be checked out next to this project at `../recipes-service`, with a `.env` that has `GITHUB_API_TOKEN` in it.

```sh
./start-voracious-appetite.sh   # starts recipes-service (port 3000) and the app (port 5175)
./stop-voracious-appetite.sh    # stops both
```

The app is served at http://localhost:5175/apps/voracious-appetite/. Logs are written to `.run/`.

## Recipe input tool

`tools/recipe-input/` is a standalone page for writing the recipe JSON files in the `my-recipes` repo. Open `tools/recipe-input/index.html` in a browser: load an existing recipe file to edit it, or fill in the form, then **Convert to JSON** and copy the output. It isn't part of the app's build or Docker image.
