const { MongoClient } = require('mongodb');

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://tabisulajoshleepagud_db_user:SFVCKdbf36goxyU0@cluster0.g9snriw.mongodb.net/?retryWrites=true&w=majority';

let cached = global._mongoCache;

async function getLetters() {
  if (cached && cached.letters) return cached.letters;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('loveletter');
  const letters = db.collection('letters');
  try {
    await letters.createIndex({ shortId: 1 }, { unique: true });
  } catch (_) {}
  cached = { letters };
  global._mongoCache = cached;
  return letters;
}

function shortId() {
  const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) id += c[Math.floor(Math.random() * c.length)];
  return id;
}

module.exports = { getLetters, shortId };
