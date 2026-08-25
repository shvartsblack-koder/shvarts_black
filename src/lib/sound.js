// Interface sound layer — page-flip / paper rustle. Only plays when user enabled it.
const KEY = 'schwarz_sound_enabled';

let enabled = false;
try { enabled = localStorage.getItem(KEY) === '1'; } catch {}

export function isSoundEnabled() { return enabled; }

export function setSoundEnabled(v) {
  enabled = !!v;
  try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch {}
  window.dispatchEvent(new Event('sound-changed'));
}

// Synthesized paper rustle via WebAudio — no external file needed.
let ctx;
function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return ctx;
}

export function playPageFlip() {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  const now = ac.currentTime;
  // filtered noise burst to mimic paper rustle
  const bufferSize = ac.sampleRate * 0.25;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800;
  filter.Q.value = 0.7;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(now);
  src.stop(now + 0.26);
}