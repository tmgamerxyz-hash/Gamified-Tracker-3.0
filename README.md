
# Genius Tracker PWA

This is the Progressive Web App (PWA) version of Genius Tracker.

## Features
- Works offline (service worker)
- Installable on mobile and desktop
- Neon "GT" app icon

## Local Testing
Service workers require HTTPS or `localhost`.

```bash
# Option A: Python
python -m http.server 8080

# Option B: Node.js
npx http-server -p 8080
```

Visit: http://localhost:8080

## Deployment

### Deploy to GitHub Pages
1. Create a new repository and push this folder's contents.
2. In GitHub, go to **Settings → Pages**.
3. Select the `main` branch and `/ (root)` folder, then save.
4. Your app will be live at: `https://<username>.github.io/<repo>/`

### Deploy to Netlify
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Drag & drop this folder into the "Sites" page.
3. Netlify will build and deploy instantly.
4. Your app will be live at a Netlify subdomain (you can set a custom domain).

## Packaging for Stores
Once deployed, visit [https://pwabuilder.com/](https://pwabuilder.com/)
- Enter your app's live URL.
- PWABuilder will generate Android, Windows, and other platform packages.

## Start URL
The `manifest.json` start URL is set to `./` so it will work on subpaths too.
