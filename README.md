# LoveLetter

Beautiful love-letter site with templates, music, QR codes, and MongoDB.

## Deploy on Vercel

### 1. Push to GitHub
Upload this folder to a GitHub repo (or use Vercel CLI).

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the repo
3. **Root Directory**: leave as project root (where `index.html` is)
4. **Framework Preset**: Other
5. **Build Command**: leave empty (or `echo ok`)
6. **Output Directory**: leave empty (static + serverless)

### 3. Environment variable
In Vercel → Project → Settings → Environment Variables:

| Name | Value |
|------|--------|
| `MONGODB_URI` | `mongodb+srv://USER:PASS@cluster0.g9snriw.mongodb.net/?retryWrites=true&w=majority` |

### 4. Deploy
Click **Deploy**. Your site will be at `https://your-project.vercel.app`

### Why CSS was missing before
Relative paths (`styles.css`) can break depending on the URL.  
This project uses **absolute paths**: `/styles.css` and `/app.js`.

### Local test
```bash
# Install API deps (optional for local serverless)
npm install

# Open index.html OR use a static server:
npx serve .
```

For full API locally on Vercel-style functions, use:
```bash
npx vercel dev
```

## Structure
```
/
├── index.html
├── styles.css
├── app.js
├── package.json          # mongodb + qrcode for API
├── vercel.json
└── api/
    ├── _db.js
    ├── health.js
    ├── letters.js
    ├── letters/[id].js
    └── qr/[id].js
```
