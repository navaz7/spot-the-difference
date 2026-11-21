// audio.js — tiny WebAudio chimes, synthesized in code (no audio files).
// A warm two-note "found it" chime, a soft thud for a miss, a sparkle
// arpeggio for hints and a little fanfare when a round is complete.

let ctx = null;

function audioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, start, duration, type, gainPeak) {
  const ac = audioContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const t = ac.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(gainPeak, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export function playFoundChime(foundCount) {
  const base = 520 + foundCount * 30;
  playTone(base, 0, 0.22, 'sine', 0.16);
  playTone(base * 1.335, 0.09, 0.3, 'sine', 0.14);
}

export function playMissThud() {
  playTone(140, 0, 0.14, 'triangle', 0.1);
}

export function playHintSparkle() {
  playTone(880, 0, 0.18, 'sine', 0.1);
  playTone(1174, 0.08, 0.18, 'sine', 0.09);
  playTone(1568, 0.16, 0.24, 'sine', 0.08);
}

export function playWinFanfare() {
  [523, 659, 784, 1046].forEach((f, i) => playTone(f, i * 0.11, 0.34, 'triangle', 0.13));
}
