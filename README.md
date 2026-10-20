# LoveLetter

Beautiful love-letter website with templates, music, QR codes, and MongoDB cloud saves.

## Features

- **12 letter templates** (Flower & Note, Wax Seal, Midnight Poetry, Soft Petals, Parchment, Ocean, Blush Rose, Lavender Dream, Sunset Glow, Emerald Garden, Noir, Cherry Blossom)
- **9 backgrounds**
- **Ambient music** (Web Audio — Soft Piano, Rain, Midnight Pad, Strings)
- **Live preview** while writing
- **Share link** + **QR code**
- **MongoDB** cloud storage so links work on any device
- Animations, particles, confetti

## Quick start (with cloud saves)

```bash
cd api
npm install
npm start
```

Open **http://localhost:3000**

Letters are saved to MongoDB. Share links and QR codes work across devices.

### Environment (optional)

```bash
export MONGODB_URI="mongodb+srv://USER:PASS@cluster0.g9snriw.mongodb.net/?retryWrites=true&w=majority"
export PORT=3000
```

## Frontend only (no server)

Open `index.html` in a browser. Letters save in **localStorage** only (same browser). QR still works via a public QR API.

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/letters` | Create letter → `{ shortId }` |
| GET | `/api/letters/:id` | Load letter |
| GET | `/api/qr/:id` | PNG QR code for share URL |
| GET | `/api/health` | Health + DB status |

## Security note

The MongoDB password was provided in chat. For production, use environment variables only and rotate credentials if they were exposed.
