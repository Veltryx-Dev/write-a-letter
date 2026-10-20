/* LoveLetter — Revamp */
const API_BASE = '';

const TEMPLATES = [
  { id: 'bouquet', name: 'Bouquet', desc: 'Pink florals', class: 'tpl-bouquet', ornament: '💐', sampleBg: 'linear-gradient(165deg,#fff7f9,#ffd6e0)', sampleColor: '#5b1530', cat: 'romantic' },
  { id: 'flower', name: 'Flower & Note', desc: 'Soft rose', class: 'tpl-flower', ornament: '❀', sampleBg: 'linear-gradient(160deg,#fff5f5,#fecdd3)', sampleColor: '#4c0519', cat: 'romantic' },
  { id: 'blush', name: 'Blush Rose', desc: 'Warm pink', class: 'tpl-blush', ornament: '♡', sampleBg: 'linear-gradient(155deg,#fff1f2,#fecdd3)', sampleColor: '#881337', cat: 'romantic' },
  { id: 'cherry', name: 'Cherry Blossom', desc: 'Spring red', class: 'tpl-cherry', ornament: '🌸', sampleBg: 'linear-gradient(160deg,#fff5f5,#feb2b2)', sampleColor: '#742a2a', cat: 'romantic' },
  { id: 'wax', name: 'Wax Seal', desc: 'Classic parchment', class: 'tpl-wax', ornament: '❧', sampleBg: 'linear-gradient(165deg,#fefce8,#fde68a)', sampleColor: '#422006', cat: 'classic' },
  { id: 'parchment', name: 'Parchment', desc: 'Aged paper', class: 'tpl-parchment', ornament: '❦', sampleBg: 'linear-gradient(160deg,#faf5f0,#e8d5b7)', sampleColor: '#3f2a1a', cat: 'classic' },
  { id: 'midnight', name: 'Midnight', desc: 'Deep indigo', class: 'tpl-midnight', ornament: '✧', sampleBg: 'linear-gradient(165deg,#1e1b4b,#312e81)', sampleColor: '#e0e7ff', cat: 'mood' },
  { id: 'ocean', name: 'Ocean', desc: 'Calm aqua', class: 'tpl-ocean', ornament: '🌊', sampleBg: 'linear-gradient(165deg,#ecfeff,#a5f3fc)', sampleColor: '#164e63', cat: 'mood' },
  { id: 'sunset', name: 'Sunset', desc: 'Golden hour', class: 'tpl-sunset', ornament: '☀', sampleBg: 'linear-gradient(165deg,#fff7ed,#fed7aa)', sampleColor: '#7c2d12', cat: 'mood' },
  { id: 'petals', name: 'Soft Petals', desc: 'Lilac haze', class: 'tpl-petals', ornament: '✿', sampleBg: 'linear-gradient(160deg,#fdf4ff,#f5d0fe)', sampleColor: '#4a044e', cat: 'soft' },
  { id: 'lavender', name: 'Lavender', desc: 'Quiet purple', class: 'tpl-lavender', ornament: '✵', sampleBg: 'linear-gradient(160deg,#f5f3ff,#ddd6fe)', sampleColor: '#4c1d95', cat: 'soft' },
  { id: 'silk', name: 'Silk Violet', desc: 'Soft violet', class: 'tpl-silk', ornament: '✦', sampleBg: 'linear-gradient(160deg,#faf5ff,#e9d5ff)', sampleColor: '#3b0764', cat: 'soft' },
];

const CATS = [
  { id: 'romantic', label: 'Romantic', icon: '💐' },
  { id: 'classic', label: 'Classic', icon: '📜' },
  { id: 'mood', label: 'Mood', icon: '🌙' },
  { id: 'soft', label: 'Soft', icon: '🌸' },
];

const BACKGROUNDS = [
  { id: 'blush', name: 'Rose', class: 'bg-blush' },
  { id: 'velvet', name: 'Velvet', class: 'bg-velvet' },
  { id: 'ember', name: 'Ember', class: 'bg-ember' },
  { id: 'night', name: 'Night', class: 'bg-night' },
  { id: 'forest', name: 'Forest', class: 'bg-forest' },
  { id: 'gold', name: 'Amber', class: 'bg-gold' },
  { id: 'sakura', name: 'Sakura', class: 'bg-sakura' },
];

const MUSIC_TRACKS = [
  { id: 'none', name: 'Silence', desc: 'No music', icon: '○' },
  { id: 'soft-piano', name: 'Soft Piano', desc: 'Gentle keys', icon: '🎹' },
  { id: 'gentle-rain', name: 'Gentle Rain', desc: 'Soft rain', icon: '🌧' },
  { id: 'midnight', name: 'Midnight Pad', desc: 'Warm drones', icon: '🌙' },
  { id: 'strings', name: 'Warm Strings', desc: 'Soft strings', icon: '🎻' },
];


const MESSAGE_TEMPLATES = [
  {
    id: 'sweet',
    label: 'Sweet note',
    title: 'Just thinking of you',
    body: 'I hope this finds you with a soft smile.\n\nEvery time I think of you, the day feels a little brighter. Thank you for being you.',
  },
  {
    id: 'miss',
    label: 'I miss you',
    title: 'Missing you',
    body: 'Distance is hard, but my heart still finds its way to you.\n\nI miss your laugh, your voice, and the quiet moments in between. Until we meet again.',
  },
  {
    id: 'love',
    label: 'I love you',
    title: 'With all my heart',
    body: 'I love you — not only for who you are, but for who I am when I am with you.\n\nToday, tomorrow, and every day after.',
  },
  {
    id: 'thanks',
    label: 'Thank you',
    title: 'Thank you',
    body: 'Thank you for the kindness you give so freely.\n\nYou make ordinary days feel special. I am grateful for you.',
  },
  {
    id: 'sorry',
    label: "I'm sorry",
    title: "I'm sorry",
    body: 'I am truly sorry for the hurt I caused.\n\nYou mean more to me than my pride. I hope we can heal this together.',
  },
  {
    id: 'blank',
    label: 'Write my own',
    title: '',
    body: '',
  },
];

const state = {
  currentStep: 1,
  selectedTemplate: 'bouquet',
  selectedBackground: 'blush',
  selectedMusic: 'none',
  letter: { to: '', from: '', title: '', body: '', date: '' },
  lastShareId: null,
  musicPlaying: false,
  apiOnline: false,
  envelopeOpened: false,
};

let audioCtx = null, masterGain = null, activeNodes = [];

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function generateId() {
  const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) id += c[Math.floor(Math.random() * c.length)];
  return id;
}

function saveLocal(id, data) {
  const all = JSON.parse(localStorage.getItem('loveletters') || '{}');
  all[id] = { ...data, createdAt: Date.now() };
  localStorage.setItem('loveletters', JSON.stringify(all));
}
function getLocal(id) {
  return JSON.parse(localStorage.getItem('loveletters') || '{}')[id] || null;
}
function allLocal() {
  return JSON.parse(localStorage.getItem('loveletters') || '{}');
}

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function stopMusic() {
  activeNodes.forEach((n) => { try { n.stop?.(); n.disconnect?.(); } catch (_) {} });
  activeNodes = [];
  state.musicPlaying = false;
  $('#music-toggle')?.classList.remove('playing');
  const el = $('#music-track-name');
  if (el) el.textContent = 'Off';
}

function playAmbient(trackId) {
  stopMusic();
  if (trackId === 'none') {
    $('#music-player')?.classList.remove('visible');
    return;
  }
  ensureAudio();
  const vol = parseFloat($('#music-volume')?.value || '0.35');
  masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
  const now = audioCtx.currentTime;

  if (trackId === 'soft-piano') {
    [261.63, 293.66, 329.63, 392, 440, 523.25].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.035, now + 0.4 + i * 0.25);
      g.gain.linearRampToValueAtTime(0.012, now + 3.5 + i);
      osc.connect(g); g.connect(masterGain);
      osc.start(now + i * 0.35);
      activeNodes.push(osc, g);
    });
  } else if (trackId === 'gentle-rain') {
    const buf = audioCtx.createBuffer(1, 2 * audioCtx.sampleRate, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const f = audioCtx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.5;
    const g = audioCtx.createGain(); g.gain.value = 0.1;
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(now);
    activeNodes.push(src, f, g);
  } else if (trackId === 'midnight') {
    [82.41, 110, 164.81].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.04 - i * 0.008, now + 1.5);
      osc.connect(g); g.connect(masterGain); osc.start(now);
      activeNodes.push(osc, g);
    });
  } else if (trackId === 'strings') {
    [196, 246.94, 293.66, 392].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.02, now + 1.2 + i * 0.3);
      osc.connect(g); g.connect(masterGain); osc.start(now + i * 0.15);
      activeNodes.push(osc, g);
    });
  }

  state.musicPlaying = true;
  state.selectedMusic = trackId;
  const tr = MUSIC_TRACKS.find((t) => t.id === trackId);
  $('#music-track-name').textContent = tr ? tr.name : trackId;
  $('#music-toggle').classList.add('playing');
  $('#music-player').classList.add('visible');
}

function toggleMusic() {
  if (state.selectedMusic === 'none') return showToast('Pick a track first');
  if (state.musicPlaying) {
    stopMusic();
    $('#music-player').classList.add('visible');
    $('#music-track-name').textContent = 'Paused';
  } else playAmbient(state.selectedMusic);
}

async function checkApi() {
  try {
    const r = await fetch(API_BASE + '/api/health', { signal: AbortSignal.timeout(3000) });
    const d = await r.json();
    state.apiOnline = !!(d && d.ok);
  } catch { state.apiOnline = false; }
  return state.apiOnline;
}

async function apiCreate(payload) {
  const r = await fetch(API_BASE + '/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('save failed');
  return r.json();
}

async function apiGet(id) {
  const r = await fetch(API_BASE + '/api/letters/' + encodeURIComponent(id));
  if (!r.ok) return null;
  return r.json();
}

function showView(name) {
  $$('.panel').forEach((p) => p.classList.remove('active'));
  const el = $('#view-' + name);
  if (el) el.classList.add('active');
  if (name === 'share') el.style.display = 'flex';
  else if ($('#view-share')) $('#view-share').style.display = '';
}

function spawnFloaters() {
  const box = $('#floaters');
  if (!box) return;
  const syms = ['♥', '❀', '✦', '♡', '✿', '💐', '🌸'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span');
    s.className = 'floater';
    s.textContent = syms[Math.floor(Math.random() * syms.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = 14 + Math.random() * 12 + 's';
    s.style.animationDelay = Math.random() * 8 + 's';
    s.style.fontSize = 0.6 + Math.random() * 0.5 + 'rem';
    box.appendChild(s);
  }
}

function burstConfetti() {
  const box = $('#confetti');
  if (!box) return;
  box.innerHTML = '';
  const colors = ['#f43f5e', '#fda4af', '#fb7185', '#f9a8d4', '#6ee7b7'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = 1.8 + Math.random() * 2 + 's';
    p.style.animationDelay = Math.random() * 0.4 + 's';
    box.appendChild(p);
  }
  setTimeout(() => { box.innerHTML = ''; }, 4000);
}

function renderHomeTemplates() {
  const root = $('#home-templates');
  let html = '';
  CATS.forEach((cat, ci) => {
    const items = TEMPLATES.filter((t) => t.cat === cat.id);
    if (!items.length) return;
    html += `<div class="cat"><div class="cat-label"><span>${cat.icon}</span> ${cat.label}</div><div class="card-grid">`;
    items.forEach((t, i) => {
      html += `<div class="style-card" data-template="${t.id}" style="animation-delay:${(ci * 0.05 + i * 0.04).toFixed(2)}s">
        <div class="style-preview"><div class="mini" style="background:${t.sampleBg};color:${t.sampleColor}">
          <div style="text-align:center;opacity:.8;margin-bottom:3px">${t.ornament}</div>
          <div style="font-style:italic;margin-bottom:2px">To: You</div>
          <div style="font-weight:600;margin-bottom:3px;font-size:.55rem">A little note</div>
          <div style="opacity:.85">Words from the heart…</div>
        </div></div>
        <div class="style-meta"><h3>${t.name}</h3><p>${t.desc}</p></div>
      </div>`;
    });
    html += `</div></div>`;
  });
  root.innerHTML = html;
  root.querySelectorAll('.style-card').forEach((c) => {
    c.addEventListener('click', () => {
      state.selectedTemplate = c.dataset.template;
      startCreate();
    });
  });
}

function renderTemplateSelect() {
  const g = $('#template-select');
  g.innerHTML = TEMPLATES.map((t) => `
    <div class="pick ${state.selectedTemplate === t.id ? 'on' : ''}" data-template="${t.id}">
      <div class="pick-prev"><div class="mini" style="background:${t.sampleBg};color:${t.sampleColor}">
        <div style="text-align:center">${t.ornament}</div>
      </div></div>
      <div class="pick-name">${t.name}</div>
    </div>
  `).join('');
  g.querySelectorAll('.pick').forEach((el) => {
    el.addEventListener('click', () => {
      state.selectedTemplate = el.dataset.template;
      renderTemplateSelect();
      updatePreview();
    });
  });
}

function renderBackgroundSelect() {
  const g = $('#bg-select');
  g.innerHTML = BACKGROUNDS.map((b) => `
    <div class="bg-swatch ${b.class} ${state.selectedBackground === b.id ? 'on' : ''}" data-bg="${b.id}">
      <span>${b.name}</span>
    </div>
  `).join('');
  g.querySelectorAll('.bg-swatch').forEach((el) => {
    el.addEventListener('click', () => {
      state.selectedBackground = el.dataset.bg;
      renderBackgroundSelect();
      updatePreview();
    });
  });
}

function renderMusicSelect() {
  const g = $('#music-select');
  g.innerHTML = MUSIC_TRACKS.map((m) => `
    <div class="music-row ${state.selectedMusic === m.id ? 'on' : ''}" data-music="${m.id}">
      <div class="ic">${m.icon}</div>
      <div class="info"><strong>${m.name}</strong><small>${m.desc}</small></div>
      <div class="check">✓</div>
    </div>
  `).join('');
  g.querySelectorAll('.music-row').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.music;
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
  stage.className = 'stage-frame ' + bg.class;

  const to = state.letter.to || 'Someone special';
  const from = state.letter.from || 'You';
  const title = state.letter.title || 'A little note for you';
  const body = state.letter.body || 'Every word carries a piece of my heart.';
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
    </div>`;
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
    </div>`;
}

function setStep(n) {
  state.currentStep = n;
  $$('.pill').forEach((p) => {
    const s = parseInt(p.dataset.step, 10);
    p.classList.remove('active', 'done');
    if (s === n) p.classList.add('active');
    else if (s < n) p.classList.add('done');
  });
  $$('.pane').forEach((p) => p.classList.remove('active'));
  const map = { 1: 'step-template', 2: 'step-background', 3: 'step-music', 4: 'step-write' };
  $(`#${map[n]}`)?.classList.add('active');
  $('#btn-prev-step').disabled = n === 1;
  $('#btn-next-step').hidden = n === 4;
  $('#btn-generate').hidden = n !== 4;
}

function startCreate() {
  state.currentStep = 1;
  state.letter = { to: '', from: '', title: '', body: '', date: '' };
  ['letter-to', 'letter-from', 'letter-title', 'letter-body'].forEach((id) => { $(`#${id}`).value = ''; });
  const d = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  $('#letter-date').value = d;
  state.letter.date = d;
  renderTemplateSelect();
  renderBackgroundSelect();
  renderMusicSelect();
  renderMsgTemplates();
  setStep(1);
  updatePreview();
  showView('create');
}

function prepareEnvelope(data) {
  state.envelopeOpened = false;
  renderLetterContent(data);

  const envelope = $('#envelope');
  const reveal = $('#letter-reveal');
  const actions = $('#letter-view-actions');
  const stage = $('#open-stage');
  const scene = $('#env-scene');
  const intro = $('#open-intro');
  const label = $('#env-to-label');

  envelope?.classList.remove('opened', 'pulling');
  reveal?.classList.remove('revealed');
  actions?.classList.remove('visible');
  stage?.classList.remove('is-open');
  scene?.classList.remove('opening', 'done');

  if (intro) {
    const to = (data.to || '').trim();
    intro.textContent = to ? `A letter for ${to}` : 'Someone sent you a letter';
  }
  if (label) {
    const to = (data.to || '').trim();
    label.textContent = to ? `For ${to}` : 'For you';
  }

  if (data.music && data.music !== 'none') state.selectedMusic = data.music;
}

function openEnvelope() {
  if (state.envelopeOpened) return;
  state.envelopeOpened = true;

  const envelope = $('#envelope');
  const reveal = $('#letter-reveal');
  const actions = $('#letter-view-actions');
  const stage = $('#open-stage');
  const scene = $('#env-scene');

  stage?.classList.add('is-open');
  scene?.classList.add('opening');

  // 1) Open flap
  envelope?.classList.add('opened');

  // 2) Pull letter sheet out of envelope
  setTimeout(() => {
    envelope?.classList.add('pulling');
  }, 380);

  // 3) Fade envelope scene, show full letter
  setTimeout(() => {
    scene?.classList.add('done');
    reveal?.classList.add('revealed');
  }, 950);

  // 4) Show close button
  setTimeout(() => {
    actions?.classList.add('visible');
  }, 1700);

  // Soft music
  if (state.selectedMusic && state.selectedMusic !== 'none') {
    setTimeout(() => {
      try { playAmbient(state.selectedMusic); } catch (_) {}
    }, 800);
  }
}

function renderMsgTemplates() {
  const box = $('#msg-templates');
  if (!box) return;
  box.innerHTML = MESSAGE_TEMPLATES.map((m) =>
    `<button type="button" class="msg-chip" data-msg="${m.id}">${m.label}</button>`
  ).join('');
  box.querySelectorAll('.msg-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      box.querySelectorAll('.msg-chip').forEach((c) => c.classList.remove('on'));
      chip.classList.add('on');
      const m = MESSAGE_TEMPLATES.find((x) => x.id === chip.dataset.msg);
      if (!m) return;
      if (m.id === 'blank') {
        // keep current text, just focus body
        $('#letter-body')?.focus();
        return;
      }
      $('#letter-title').value = m.title;
      $('#letter-body').value = m.body;
      state.letter.title = m.title;
      state.letter.body = m.body;
      updatePreview();
      showToast('Template applied — edit freely');
    });
  });
}

async function generateShareLink() {
  if (!state.letter.body.trim() && !state.letter.to.trim()) {
    return showToast('Write something first');
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
  btn.disabled = true;
  btn.textContent = 'Saving…';

  let shortId = null;
  let cloud = false;
  try {
    await checkApi();
    if (state.apiOnline) {
      const res = await apiCreate(payload);
      shortId = res.shortId || res.id;
      cloud = true;
    }
  } catch (_) {}

  if (!shortId) {
    shortId = generateId();
    saveLocal(shortId, payload);
  } else saveLocal(shortId, payload);

  state.lastShareId = shortId;
  const base = location.origin + (location.pathname.replace(/\/$/, '') || '');
  const url = `${base}/?letter=${shortId}`;
  $('#share-link-input').value = url;

  const qr = $('#share-qr-img');
  if (cloud && state.apiOnline) {
    qr.src = API_BASE + '/api/qr/' + encodeURIComponent(shortId);
  } else {
    qr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=f43f5e&bgcolor=ffffff&data=' + encodeURIComponent(url);
  }

  const note = $('#share-saved-note');
  if (note) {
    note.textContent = cloud ? 'Saved · works on any device' : 'Saved on this device';
    note.style.color = cloud ? 'var(--mint)' : 'var(--dim)';
  }

  btn.disabled = false;
  btn.textContent = 'Create link';
  showView('share');
  burstConfetti();
  showToast(cloud ? 'Link ready' : 'Link ready (local)');
}

function renderMyLetters() {
  const all = allLocal();
  const ids = Object.keys(all).sort((a, b) => (all[b].createdAt || 0) - (all[a].createdAt || 0));
  const list = $('#my-letters-list');
  const empty = $('#my-letters-empty');
  if (!ids.length) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  list.innerHTML = ids.map((id, i) => {
    const l = all[id];
    const tpl = TEMPLATES.find((t) => t.id === l.template);
    return `<div class="letter-item" data-id="${id}" style="animation-delay:${i * 0.04}s">
      <h3>${escapeHtml(l.title || l.to || 'Untitled')}</h3>
      <p>To: ${escapeHtml(l.to || '—')} · ${tpl ? tpl.name : ''}</p>
      <div class="meta"><span>${escapeHtml(l.date || '')}</span><span style="color:var(--rose)">Open →</span></div>
    </div>`;
  }).join('');
  list.querySelectorAll('.letter-item').forEach((el) => {
    el.addEventListener('click', () => openLetterById(el.dataset.id));
  });
}

async function openLetterById(id) {
  let data = null;
  try {
    await checkApi();
    if (state.apiOnline) data = await apiGet(id);
  } catch (_) {}
  if (!data) data = getLocal(id);
  if (!data) return showToast('Letter not found');
  prepareEnvelope(data);
  showView('letter');
}

async function handleUrl() {
  const id = new URLSearchParams(location.search).get('letter');
  if (!id) return false;
  let data = null;
  try {
    await checkApi();
    if (state.apiOnline) data = await apiGet(id);
  } catch (_) {}
  if (!data) data = getLocal(id);
  if (data) {
    prepareEnvelope(data);
    showView('letter');
    return true;
  }
  showToast('Letter not found');
  return false;
}

function bind() {
  $('#nav-logo').addEventListener('click', (e) => { e.preventDefault(); showView('home'); });
  $('#btn-create').addEventListener('click', () => startCreate());
  $('#btn-my-letters').addEventListener('click', () => { renderMyLetters(); showView('my-letters'); });
  $('#hero-create').addEventListener('click', () => startCreate());
  $('#hero-templates').addEventListener('click', () => {
    $('#templates-anchor')?.scrollIntoView({ behavior: 'smooth' });
  });
  $('#btn-back-home').addEventListener('click', () => showView('home'));
  $('#btn-back-from-letter').addEventListener('click', () => {
    history.replaceState({}, '', location.pathname);
    stopMusic();
    showView('home');
  });
  $('#btn-back-from-my').addEventListener('click', () => showView('home'));
  $('#btn-empty-create').addEventListener('click', () => startCreate());

  $('#btn-prev-step').addEventListener('click', () => { if (state.currentStep > 1) setStep(state.currentStep - 1); });
  $('#btn-next-step').addEventListener('click', () => { if (state.currentStep < 4) setStep(state.currentStep + 1); });
  $('#btn-generate').addEventListener('click', generateShareLink);

  $$('.pill').forEach((p) => {
    p.addEventListener('click', () => setStep(parseInt(p.dataset.step, 10)));
  });

  ['letter-to', 'letter-from', 'letter-title', 'letter-body', 'letter-date'].forEach((id) => {
    $(`#${id}`).addEventListener('input', (e) => {
      state.letter[id.replace('letter-', '')] = e.target.value;
      updatePreview();
    });
  });

  $('#btn-copy-link').addEventListener('click', () => {
    const input = $('#share-link-input');
    input.select();
    navigator.clipboard.writeText(input.value).then(() => showToast('Copied')).catch(() => showToast('Copy manually'));
  });
  $('#btn-open-letter').addEventListener('click', () => { if (state.lastShareId) openLetterById(state.lastShareId); });
  $('#btn-download-qr')?.addEventListener('click', () => {
    const img = $('#share-qr-img');
    if (!img?.src) return;
    const a = document.createElement('a');
    a.href = img.src; a.download = 'loveletter-qr.png'; a.target = '_blank'; a.click();
  });
  $('#btn-create-another').addEventListener('click', () => startCreate());
  $('#btn-fullscreen-preview').addEventListener('click', () => $('#preview-stage').classList.toggle('fullscreen'));
  $('#music-toggle').addEventListener('click', toggleMusic);
  $('#music-volume').addEventListener('input', (e) => {
    if (masterGain && audioCtx) masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
  });

  const env = $('#envelope');
  env?.addEventListener('click', openEnvelope);
  env?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
}

async function init() {
  spawnFloaters();
  renderHomeTemplates();
  bind();
  await checkApi();
  if (!(await handleUrl())) showView('home');
}

document.addEventListener('DOMContentLoaded', init);
