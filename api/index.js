/**
 * LoveLetter API
 * MongoDB-backed letter storage + QR generation
 *
 * Run: npm install && npm start
 * Env: MONGODB_URI (optional — defaults to the provided cluster)
 */

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://tabisulajoshleepagud_db_user:SFVCKdbf36goxyU0@cluster0.g9snriw.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'loveletter';
const COLLECTION = 'letters';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve frontend from parent artifacts folder
app.use(express.static(path.join(__dirname, '..')));

let letters = null;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  letters = db.collection(COLLECTION);
  await letters.createIndex({ shortId: 1 }, { unique: true });
  console.log('✓ Connected to MongoDB');
}

function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

app.post('/api/letters', async (req, res) => {
  try {
    const { template, background, music, to, from, title, body, date } = req.body;
    if (!body && !to) {
      return res.status(400).json({ error: 'Letter needs at least a recipient or body' });
    }

    let shortId = generateShortId();
    for (let i = 0; i < 5; i++) {
      const existing = await letters.findOne({ shortId });
      if (!existing) break;
      shortId = generateShortId();
    }

    const doc = {
      shortId,
      template: template || 'flower',
      background: background || 'velvet',
      music: music || 'none',
      to: String(to || '').slice(0, 80),
      from: String(from || '').slice(0, 80),
      title: String(title || '').slice(0, 120),
      body: String(body || '').slice(0, 8000),
      date:
        date ||
        new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      createdAt: new Date(),
      views: 0,
    };

    await letters.insertOne(doc);
    res.status(201).json({ id: shortId, shortId, createdAt: doc.createdAt });
  } catch (err) {
    console.error('POST /api/letters', err);
    res.status(500).json({ error: 'Failed to save letter' });
  }
});

app.get('/api/letters/:id', async (req, res) => {
  try {
    const doc = await letters.findOneAndUpdate(
      { shortId: req.params.id },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    if (!doc) return res.status(404).json({ error: 'Letter not found' });
    const { _id, ...letter } = doc;
    res.json(letter);
  } catch (err) {
    console.error('GET /api/letters/:id', err);
    res.status(500).json({ error: 'Failed to load letter' });
  }
});

app.get('/api/letters', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const list = await letters
      .find({})
      .project({ body: 0 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    res.json(list.map(({ _id, ...rest }) => rest));
  } catch (err) {
    console.error('GET /api/letters', err);
    res.status(500).json({ error: 'Failed to list letters' });
  }
});

app.get('/api/qr/:id', async (req, res) => {
  try {
    const doc = await letters.findOne({ shortId: req.params.id });
    if (!doc) return res.status(404).json({ error: 'Letter not found' });

    const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
    const host = req.get('x-forwarded-host') || req.get('host');
    const url = `${protocol}://${host}/?letter=${req.params.id}`;

    const png = await QRCode.toBuffer(url, {
      type: 'png',
      width: 320,
      margin: 2,
      color: { dark: '#e11d48', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });

    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(png);
  } catch (err) {
    console.error('GET /api/qr/:id', err);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: !!letters, time: new Date().toISOString() });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`♥ LoveLetter running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

start();
