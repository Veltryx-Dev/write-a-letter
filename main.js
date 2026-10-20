/* LoveLetter v4 — Envelope open · Bouquet · Clean QR */

const API_BASE = '';

const TEMPLATES = [
  {
    id: 'bouquet',
    name: 'Bouquet of Flowers',
    desc: 'Soft pink with a floral bouquet',
    class: 'tpl-bouquet',
    ornament: '💐',
    sampleBg: 'linear-gradient(165deg, #fff7f9 0%, #ffe8ee 40%, #ffd6e0 100%)',
    sampleColor: '#5b1530',
  },
  {
    id: 'flower',
    name: 'Flower & Note',
    desc: 'Soft rose tones with delicate florals',
    class: 'tpl-flower',
    ornament: '❀',
    sampleBg: 'linear-gradient(160deg, #fff5f5 0%, #ffe4e6 50%, #fecdd3 100%)',
    sampleColor: '#4c0519',
  },
  {
    id: 'wax',
    name: 'Wax Seal',
    desc: 'Warm parchment with a classic seal',
    class: 'tpl-wax',
    ornament: '❧',
    sampleBg: 'linear-gradient(165deg, #fefce8 0%, #fef9c3 40%, #fde68a 100%)',
    sampleColor: '#422006',
  },
  {
    id: 'midnight',
    name: 'Midnight Poetry',
    desc: 'Deep indigo for night-time words',
    class: 'tpl-midnight',
    ornament: '✧',
    sampleBg: 'linear-gradient(165deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    sampleColor: '#e0e7ff',
  },
  {
    id: 'petals',
    name: 'Soft Petals',
    desc: 'Gentle lilac and blush',
    class: 'tpl-petals',
    ornament: '✿',
    sampleBg: 'linear-gradient(160deg, #fdf4ff 0%, #fae8ff 40%, #f5d0fe 100%)',
    sampleColor: '#4a044e',
  },
  {
    id: 'parchment',
    name: 'Classic Parchment',
    desc: 'Timeless aged paper feel',
    class: 'tpl-parchment',
    ornament: '❦',
    sampleBg: 'linear-gradient(160deg, #faf5f0 0%, #f5e6d3 50%, #e8d5b7 100%)',
    sampleColor: '#3f2a1a',
  },
  {
    id: 'ocean',
    name: 'Ocean Whisper',
    desc: 'Calm aqua and soft teal',
    class: 'tpl-ocean',
    ornament: '🌊',
    sampleBg: 'linear-gradient(165deg, #ecfeff 0%, #cffafe 40%, #a5f3fc 100%)',
    sampleColor: '#164e63',
  },
  {
    id: 'blush',
    name: 'Blush Rose',
    desc: 'Romantic pink with soft warmth',
    class: 'tpl-blush',
    ornament: '♡',
    sampleBg: 'linear-gradient(155deg, #fff1f2 0%, #ffe4e6 40%, #fecdd3 100%)',
    sampleColor: '#881337',
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    desc: 'Calm purple for quiet thoughts',
    class: 'tpl-lavender',
    ornament: '✵',
    sampleBg: 'linear-gradient(160deg, #f5f3ff 0%, #ede9fe 45%, #ddd6fe 100%)',
    sampleColor: '#4c1d95',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    desc: 'Warm orange and golden hour',
    class: 'tpl-sunset',
    ornament: '☀',
    sampleBg: 'linear-gradient(165deg, #fff7ed 0%, #ffedd5 35%, #fed7aa 100%)',
    sampleColor: '#7c2d12',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    desc: 'Soft red-pink spring vibes',
    class: 'tpl-cherry',
    ornament: '🌸',
    sampleBg: 'linear-gradient(160deg, #fff5f5 0%, #fed7d7 30%, #feb2b2 100%)',
    sampleColor: '#742a2a',
  },
];

const BACKGROUNDS = [
  { id: 'velvet', name: 'Velvet Night', class: 'bg-velvet' },
  { id: 'ember', name: 'Ember Glow', class: 'bg-ember' },
  { id: 'forest', name: 'Deep Forest', class: 'bg-forest' },
  { id: 'night', name: 'Indigo Sky', class: 'bg-night' },
  { id: 'blush', name: 'Rose Shadow', class: 'bg-blush' },
  { id: 'gold', name: 'Amber Light', class: 'bg-gold' },
  { id: 'sakura', name: 'Sakura Night', class: 'bg-sakura' },
];

const MUSIC_TRACKS = [
  { id: 'none', name: 'Silence', desc: 'No background music', icon: '○' },
  { id: 'soft-piano', name: 'Soft Piano', desc: 'Gentle romantic keys', icon: '🎹' },
  { id: 'gentle-rain', name: 'Gentle Rain', desc: 'Soft rain & ambience', icon: '🌧' },
  { id: 'midnight', name: 'Midnight Pad', desc: 'Warm ambient drones', icon: '🌙' },
  { id: 'strings', name: 'Warm Strings', desc: 'Soft string ensemble', icon: '🎻' },
];

const state = {
  currentView: 'home',
  currentStep: 1,
  selectedTemplate: 'bouquet',
  selectedBackground: 'blush',
  selectedMusic: 'none',
  letter: { to: '', from: '', title: '', body: '', date: '' },
  lastShareId: null,
  lastShareUrl: null,
  musicPlaying: false,
  apiOnline: false,
  envelopeOpened: false,
};

let audioCtx = null;
let masterGain = null;
let activeNodes = [];

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function stopMusic() {
  activeNodes.forEach((n) => {
    try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch (_) {}
  });
  activeNodes = [];
  state.musicPlaying = false;
  const btn = document.getElementById('music-toggle');
  if (btn) btn.classList.remove('playing');
  const nameEl = document.getElementById('music-track-name');
  if (nameEl) nameEl.textContent = 'No music';
}

function playAmbient(trackId) {
  stopMusic();
  if (trackId === 'none') {
    document.getElementById('music-player')?.classList.remove('visible');
    return;
  }
  ensureAudio();
  const vol = parseFloat(document.getElementById('music-volume')?.value || '0.35');
  masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
  const now = audioCtx.currentTime;

  if (trackId === 'soft-piano') {
    [261.63, 293.66, 329.63, 392.0, 440.0, 523.25].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.04, now + 0.5 + i * 0.3);
      g.gain.linearRampToValueAtTime(0.015, now + 4 + i);
      osc.connect(g); g.connect(masterGain);
      osc.start(now + i * 0.4);
      const lfo = audioCtx.createOscillator();
      const lfoG = audioCtx.createGain();
      lfo.frequency.value = 0.08 + i * 0.02;
      lfoG.gain.value = 8;
      lfo.connect(lfoG); lfoG.connect(osc.frequency); lfo.start(now);
      activeNodes.push(osc, g, lfo, lfoG);
    });
  } else if (trackId === 'gentle-rain') {
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer; noise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 800; filter.Q.value = 0.6;
    const g = audioCtx.createGain(); g.gain.value = 0.12;
    noise.connect(filter); filter.connect(g); g.connect(masterGain);
    noise.start(now);
    activeNodes.push(noise, filter, g);
    const osc = audioCtx.createOscillator();
    const og = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = 110; og.gain.value = 0.03;
    osc.connect(og); og.connect(masterGain); osc.start(now);
    activeNodes.push(osc, og);
  } else if (trackId === 'midnight') {
    [82.41, 110, 164.81].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.05 - i * 0.01, now + 2);
      osc.connect(g); g.connect(masterGain); osc.start(now);
      const lfo = audioCtx.createOscillator();
      const lfoG = audioCtx.createGain();
      lfo.frequency.value = 0.05 + i * 0.015; lfoG.gain.value = 4;
      lfo.connect(lfoG); lfoG.connect(osc.frequency); lfo.start(now);
      activeNodes.push(osc, g, lfo, lfoG);
    });
  } else if (trackId === 'strings') {
    [196, 246.94, 293.66, 392].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.025, now + 1.5 + i * 0.4);
      osc.connect(g); g.connect(masterGain); osc.start(now + i * 0.2);
      activeNodes.push(osc, g);
    });
  }

  state.musicPlaying = true;
  state.selectedMusic = trackId;
  const track = MUSIC_TRACKS.find((t) => t.id === trackId);
  document.getElementById('music-track-name').textContent = track ? track.name : trackId;
  document.getElementById('music-toggle').classList.add('playing');
  document.getElementById('music-player').classList.add('visible');
}

function toggleMusic() {
  if (state.selectedMusic === 'none') { showToast('Select a track first'); return; }
  if (state.musicPlaying) {
    stopMusic();
    document.getElementById('music-player').classList.add('visible');
    document.getElementById('music-track-name').textContent = 'Paused';
  } else playAmbient(state.selectedMusic);
}

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function saveLetterLocal(id, data) {
  const letters = JSON.parse(localStorage.getItem('loveletters') || '{}');
  letters[id] = { ...data, createdAt: Date.now() };
  localStorage.setItem('loveletters', JSON.stringify(letters));
}

function getLetterLocal(id) {
  return JSON.parse(localStorage.getItem('loveletters') || '{}')[id] || null;
}

function getAllLettersLocal() {
  return JSON.parse(localStorage.getItem('loveletters') || '{}');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function checkApi() {
  try {
    const res = await fetch(API_BASE + '/api/health', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    state.apiOnline = !!(data && data.ok);
  } catch { state.apiOnline = false; }
  return state.apiOnline;
}

async function apiCreateLetter(payload) {
  const res = await fetch(API_BASE + '/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Save failed');
  return res.json();
}

async function apiGetLetter(id) {
  const res = await fetch(API_BASE + '/api/letters/' + encodeURIComponent(id));
  if (!res.ok) return null;
  return res.json();
}

function spawnParticles() {
  const container = $('#particles');
  if (!container) return;
  const symbols = ['♥', '❀', '✦', '♡', '✿', '✧', '💐', '🌸'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = 14 + Math.random() * 14 + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.fontSize = 0.65 + Math.random() * 0.6 + 'rem';
    container.appendChild(p);
  }
}

function burstConfetti() {
  const container = $('#confetti');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#f43f5e', '#fda4af', '#fb7185', '#f9a8d4', '#fecdd3', '#6ee7b7'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 2 + Math.random() * 2.2 + 's';
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.width = 5 + Math.random() * 7 + 'px';
    piece.style.height = 5 + Math.random() * 7 + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 4500);
}

function showView(name) {
  $$('.view').forEach((v) => v.classList.remove('active'));
  const el = $(`#view-${name}`);
  if (el) { el.classList.add('active'); state.currentView = name; }
  if (name === 'share') $('#view-share').style.display = 'flex';
  else $('#view-share').style.display = '';
}

function renderHomeTemplates() {
  const grid = $('#home-templates');
  const categories = [
    { id: 'romantic', label: 'Romantic', icon: '💐' },
    { id: 'classic', label: 'Classic', icon: '📜' },
    { id: 'mood', label: 'Mood & Night', icon: '🌙' },
    { id: 'soft', label: 'Soft & Pastel', icon: '🌸' },
  ];
  const byCat = {
    romantic: ['bouquet', 'flower', 'blush', 'cherry'],
    classic: ['wax', 'parchment'],
    mood: ['midnight', 'ocean', 'sunset'],
    soft: ['petals', 'lavender'],
  };

  let html = '';
  categories.forEach((cat) => {
    const ids = byCat[cat.id] || [];
    const items = TEMPLATES.filter((t) => ids.includes(t.id));
    if (!items.length) return;
    html += `<div class="template-category">
      <div class="category-label"><span>${cat.icon}</span> ${cat.label}</div>
      <div class="template-grid category-grid">`;
    items.forEach((t) => {
      html += `
      <div class="template-card" data-template="${t.id}">
        <div class="template-preview">
          <div class="mini-letter" style="background:${t.sampleBg};color:${t.sampleColor}">
            <div style="text-align:center;margin-bottom:3px;opacity:0.75">${t.ornament}</div>
            <div style="font-style:italic;margin-bottom:3px">To: Someone special</div>
            <div style="font-weight:600;margin-bottom:4px;font-size:0.58rem">A little note for you</div>
            <div style="opacity:0.85">Every word carries a piece of my heart...</div>
          </div>
        </div>
        <div class="template-info">
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
        </div>
      </div>`;
    });
    html += `</div></div>`;
  });
  grid.innerHTML = html;
  grid.querySelectorAll('.template-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.selectedTemplate = card.dataset.template;
      startCreate();
    });
  });
}

function renderTemplateSelect() {
  const grid = $('#template-select');
  grid.innerHTML = TEMPLATES.map((t) => `
    <div class="template-option ${state.selectedTemplate === t.id ? 'selected' : ''}" data-template="${t.id}">
      <div class="opt-preview">
        <div class="mini-letter" style="background:${t.sampleBg};color:${t.sampleColor}">
          <div style="text-align:center;opacity:0.7">${t.ornament}</div>
          <div style="font-style:italic">Dear...</div>
        </div>
      </div>
      <div class="opt-name">${t.name}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.template-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      state.selectedTemplate = opt.dataset.template;
      renderTemplateSelect();
      updatePreview();
    });
  });
}

function renderBackgroundSelect() {
  const grid = $('#bg-select');
  grid.innerHTML = BACKGROUNDS.map((b) => `
    <div class="bg-option ${b.class} ${state.selectedBackground === b.id ? 'selected' : ''}" data-bg="${b.id}">
      <div class="bg-name">${b.name}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.bg-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      state.selectedBackground = opt.dataset.bg;
      renderBackgroundSelect();
      updatePreview();
    });
  });
}

function renderMusicSelect() {
  const grid = $('#music-select');
  grid.innerHTML = MUSIC_TRACKS.map((m) => `
    <div class="music-option ${state.selectedMusic === m.id ? 'selected' : ''}" data-music="${m.id}">
      <div class="music-icon">${m.icon}</div>
      <div class="music-meta"><h4>${m.name}</h4><p>${m.desc}</p></div>
      <div class="music-check">✓</div>
    </div>
  `).join('');
  grid.querySelectorAll('.music-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      const id = opt.dataset.music;
      state.selectedMusic = id;
      renderMusicSelect();
      if (id === 'none') {
        stopMusic();
        $('#music-player').classList.remove('visible');
      } else playAmbient(id);
    });
  });
}

function updatePreview() {
  const tpl = TEMPLATES.find((t) => t.id === state.selectedTemplate) || TEMPLATES[0];
  const bg = BACKGROUNDS.find((b) => b.id === state.selectedBackground) || BACKGROUNDS[0];
  const stage = $('#preview-stage');
  const card = $('#letter-preview');
  stage.className = 'preview-stage ' + bg.class;

  const to = state.letter.to || 'Someone special';
  const from = state.letter.from || 'You';
  const title = state.letter.title || 'A little note for you';
  const body = state.letter.body || 'Every word I write carries a piece of my heart. I hope this finds you smiling.';
  const date = state.letter.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  card.className = 'letter-card ' + tpl.class;
  card.innerHTML = `
    <div class="letter-ornament">${tpl.ornament}</div>
    <div class="letter-to">To: ${escapeHtml(to)}</div>
    <div class="letter-title">${escapeHtml(title)}</div>
    <div class="letter-body">${escapeHtml(body)}</div>
    <div class="letter-footer">
      <div class="letter-from">— ${escapeHtml(from)}</div>
      <div class="letter-date">${escapeHtml(date)}</div>
    </div>
  `;
}

function renderLetterContent(data) {
  const tpl = TEMPLATES.find((t) => t.id === data.template) || TEMPLATES[0];
  const card = $('#letter-display');
  card.className = 'letter-card letter-view ' + tpl.class;
  card.innerHTML = `
    <div class="letter-ornament">${tpl.ornament}</div>
    <div class="letter-to">To: ${escapeHtml(data.to || 'Someone special')}</div>
    <div class="letter-title">${escapeHtml(data.title || 'A little note for you')}</div>
    <div class="letter-body">${escapeHtml(data.body || '')}</div>
    <div class="letter-footer">
      <div class="letter-from">— ${escapeHtml(data.from || 'You')}</div>
      <div class="letter-date">${escapeHtml(data.date || '')}</div>
    </div>
  `;
}

/* Envelope open sequence */
function prepareEnvelope(data) {
  state.envelopeOpened = false;
  renderLetterContent(data);

  const envelope = $('#envelope');
  const reveal = $('#letter-reveal');
  const actions = $('#letter-view-actions');

  envelope.classList.remove('opened');
  reveal.classList.remove('revealed');
  actions.classList.remove('visible');
  actions.style.opacity = '0';
  actions.style.pointerEvents = 'none';

  if (data.music && data.music !== 'none') {
    state.selectedMusic = data.music;
  }
}

function openEnvelope() {
  if (state.envelopeOpened) return;
  state.envelopeOpened = true;

  const envelope = $('#envelope');
  const reveal = $('#letter-reveal');
  const actions = $('#letter-view-actions');

  envelope.classList.add('opened');

  setTimeout(() => {
    reveal.classList.add('revealed');
  }, 350);

  setTimeout(() => {
    actions.classList.add('visible');
  }, 1100);

  // Soft music after open
  if (state.selectedMusic && state.selectedMusic !== 'none') {
    setTimeout(() => {
      try { playAmbient(state.selectedMusic); } catch (_) {}
    }, 600);
  }
}

function setStep(n) {
  state.currentStep = n;
  $$('.step').forEach((s) => {
    const stepNum = parseInt(s.dataset.step, 10);
    s.classList.remove('active', 'done');
    if (stepNum === n) s.classList.add('active');
    else if (stepNum < n) s.classList.add('done');
  });
  $$('.step-panel').forEach((p) => p.classList.remove('active'));
  if (n === 1) $('#step-template').classList.add('active');
  if (n === 2) $('#step-background').classList.add('active');
  if (n === 3) $('#step-music').classList.add('active');
  if (n === 4) $('#step-write').classList.add('active');
  $('#btn-prev-step').disabled = n === 1;
  $('#btn-next-step').style.display = n < 4 ? 'inline-flex' : 'none';
  $('#btn-generate').style.display = n === 4 ? 'inline-flex' : 'none';
}

function startCreate() {
  state.currentStep = 1;
  state.letter = { to: '', from: '', title: '', body: '', date: '' };
  $('#letter-to').value = '';
  $('#letter-from').value = '';
  $('#letter-title').value = '';
  $('#letter-body').value = '';
  $('#letter-date').value = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  state.letter.date = $('#letter-date').value;
  renderTemplateSelect();
  renderBackgroundSelect();
  renderMusicSelect();
  setStep(1);
  updatePreview();
  showView('create');
}

async function generateShareLink() {
  if (!state.letter.body.trim() && !state.letter.to.trim()) {
    showToast('Write something first 💌');
    return;
  }

  const payload = {
    template: state.selectedTemplate,
    background: state.selectedBackground,
    music: state.selectedMusic,
    to: state.letter.to,
    from: state.letter.from,
    title: state.letter.title,
    body: state.letter.body,
    date: state.letter.date,
  };

  const btn = $('#btn-generate');
  const txt = btn.querySelector('.btn-text');
  if (txt) txt.textContent = 'Saving…';
  btn.disabled = true;

  let shortId = null;
  let usedCloud = false;

  try {
    await checkApi();
    if (state.apiOnline) {
      const result = await apiCreateLetter(payload);
      shortId = result.shortId || result.id;
      usedCloud = true;
    }
  } catch (err) {
    console.warn('API fallback', err);
  }

  if (!shortId) {
    shortId = generateId();
    saveLetterLocal(shortId, payload);
  } else {
    saveLetterLocal(shortId, payload);
  }

  state.lastShareId = shortId;
  const base = window.location.origin + (window.location.pathname.replace(/\/$/, '') || '');
  const shareUrl = `${base}/?letter=${shortId}`;
  state.lastShareUrl = shareUrl;
  $('#share-link-input').value = shareUrl;

  const qrImg = $('#share-qr-img');
  if (usedCloud && state.apiOnline) {
    qrImg.src = API_BASE + '/api/qr/' + encodeURIComponent(shortId);
  } else {
    qrImg.src =
      'https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=f43f5e&bgcolor=ffffff&data=' +
      encodeURIComponent(shareUrl);
  }
  $('#share-qr-wrap').style.display = 'flex';

  const note = $('#share-saved-note');
  if (note) {
    note.textContent = usedCloud
      ? 'Saved to the cloud · works on any device'
      : 'Saved on this device';
    note.style.color = usedCloud ? 'var(--mint)' : 'var(--text-dim)';
  }

  if (txt) txt.textContent = 'Generate Share Link';
  btn.disabled = false;

  showView('share');
  burstConfetti();
  showToast(usedCloud ? 'Saved & ready to share 💌' : 'Share link ready');
}

function renderMyLetters() {
  const letters = getAllLettersLocal();
  const ids = Object.keys(letters).sort(
    (a, b) => (letters[b].createdAt || 0) - (letters[a].createdAt || 0)
  );
  const list = $('#my-letters-list');
  const empty = $('#my-letters-empty');

  if (ids.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = ids.map((id, idx) => {
    const l = letters[id];
    const tpl = TEMPLATES.find((t) => t.id === l.template);
    const title = l.title || l.to || 'Untitled letter';
    const date = l.date || new Date(l.createdAt).toLocaleDateString();
    return `
      <div class="my-letter-card" data-id="${id}" style="animation-delay:${idx * 0.04}s">
        <h3>${escapeHtml(title)}</h3>
        <p>To: ${escapeHtml(l.to || '—')} · ${tpl ? tpl.name : 'Custom'}</p>
        <div class="card-meta">
          <span>${escapeHtml(date)}</span>
          <span style="color:var(--accent)">Open →</span>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.my-letter-card').forEach((card) => {
    card.addEventListener('click', () => openLetterById(card.dataset.id));
  });
}

async function openLetterById(id) {
  let data = null;
  try {
    await checkApi();
    if (state.apiOnline) data = await apiGetLetter(id);
  } catch (_) {}
  if (!data) data = getLetterLocal(id);
  if (!data) { showToast('Letter not found'); return; }

  prepareEnvelope(data);
  showView('letter');
}

async function handleUrl() {
  const params = new URLSearchParams(window.location.search);
  const letterId = params.get('letter');
  if (letterId) {
    let data = null;
    try {
      await checkApi();
      if (state.apiOnline) data = await apiGetLetter(letterId);
    } catch (_) {}
    if (!data) data = getLetterLocal(letterId);
    if (data) {
      prepareEnvelope(data);
      showView('letter');
      return true;
    }
    showToast('Letter not found');
  }
  return false;
}

function bindEvents() {
  $('#nav-logo').addEventListener('click', (e) => { e.preventDefault(); showView('home'); });
  $('#btn-create').addEventListener('click', () => startCreate());
  $('#btn-my-letters').addEventListener('click', () => {
    renderMyLetters();
    showView('my-letters');
  });
  $('#hero-create').addEventListener('click', () => startCreate());
  $('#hero-templates').addEventListener('click', () => {
    document.querySelector('.templates-section')?.scrollIntoView({ behavior: 'smooth' });
  });
  $('#btn-back-home').addEventListener('click', () => showView('home'));
  $('#btn-back-from-letter').addEventListener('click', () => {
    window.history.replaceState({}, '', window.location.pathname);
    stopMusic();
    showView('home');
  });
  $('#btn-back-from-my').addEventListener('click', () => showView('home'));
  $('#btn-empty-create').addEventListener('click', () => startCreate());

  $('#btn-prev-step').addEventListener('click', () => {
    if (state.currentStep > 1) setStep(state.currentStep - 1);
  });
  $('#btn-next-step').addEventListener('click', () => {
    if (state.currentStep < 4) setStep(state.currentStep + 1);
  });
  $('#btn-generate').addEventListener('click', generateShareLink);

  ['letter-to', 'letter-from', 'letter-title', 'letter-body', 'letter-date'].forEach((id) => {
    const el = $(`#${id}`);
    el.addEventListener('input', () => {
      state.letter[id.replace('letter-', '')] = el.value;
      updatePreview();
    });
  });

  $('#btn-copy-link').addEventListener('click', () => {
    const input = $('#share-link-input');
    input.select();
    navigator.clipboard.writeText(input.value)
      .then(() => showToast('Link copied 💌'))
      .catch(() => showToast('Select and copy manually'));
  });

  $('#btn-open-letter').addEventListener('click', () => {
    if (state.lastShareId) openLetterById(state.lastShareId);
  });

  $('#btn-download-qr')?.addEventListener('click', () => {
    const img = $('#share-qr-img');
    if (!img?.src) return;
    const a = document.createElement('a');
    a.href = img.src;
    a.download = 'loveletter-qr.png';
    a.target = '_blank';
    a.click();
    showToast('QR download started');
  });

  $('#btn-create-another').addEventListener('click', () => startCreate());
  $('#btn-fullscreen-preview').addEventListener('click', () => {
    $('#preview-stage').classList.toggle('fullscreen');
  });
  $('#music-toggle').addEventListener('click', toggleMusic);
  $('#music-volume').addEventListener('input', (e) => {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
    }
  });

  // Envelope tap to open
  $('#envelope')?.addEventListener('click', openEnvelope);
}

async function init() {
  spawnParticles();
  renderHomeTemplates();
  bindEvents();
  await checkApi();
  if (!(await handleUrl())) showView('home');
}

document.addEventListener('DOMContentLoaded', init);
