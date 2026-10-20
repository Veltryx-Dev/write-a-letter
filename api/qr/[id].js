const QRCode = require('qrcode');
const { getLetters } = require('../_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const col = await getLetters();
    const doc = await col.findOne({ shortId: id });
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const url = proto + '://' + host + '/?letter=' + id;

    const png = await QRCode.toBuffer(url, {
      type: 'png',
      width: 320,
      margin: 2,
      color: { dark: '#f43f5e', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(png);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'QR failed' });
  }
};
