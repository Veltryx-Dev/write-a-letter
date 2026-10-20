const { getLetters, shortId } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const col = await getLetters();

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (!body.body && !body.to) {
        return res.status(400).json({ error: 'Need recipient or body' });
      }
      let id = shortId();
      for (let i = 0; i < 5; i++) {
        if (!(await col.findOne({ shortId: id }))) break;
        id = shortId();
      }
      const doc = {
        shortId: id,
        template: body.template || 'bouquet',
        background: body.background || 'blush',
        music: body.music || 'none',
        to: String(body.to || '').slice(0, 80),
        from: String(body.from || '').slice(0, 80),
        title: String(body.title || '').slice(0, 120),
        body: String(body.body || '').slice(0, 8000),
        date: body.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: new Date(),
        views: 0,
      };
      await col.insertOne(doc);
      return res.status(201).json({ id, shortId: id, createdAt: doc.createdAt });
    }

    if (req.method === 'GET') {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
      const list = await col.find({}).project({ body: 0 }).sort({ createdAt: -1 }).limit(limit).toArray();
      return res.json(list.map(({ _id, ...r }) => r));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
