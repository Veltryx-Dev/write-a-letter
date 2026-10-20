const { getLetters } = require('../_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const col = await getLetters();
    const doc = await col.findOneAndUpdate(
      { shortId: id },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    if (!doc) return res.status(404).json({ error: 'Letter not found' });
    const { _id, ...letter } = doc;
    return res.json(letter);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
