// game.js — the game itself: rounds, clicking, the timer, hints,
// keyboard probing and the win flow. Scene drawing lives in scenes.js,
// the difference data in differences.js, sounds in audio.js, HUD in ui.js.

import { ROUNDS } from './differences.js';
import { buildSceneSVG } from './scenes.js';
import { playFoundChime, playMissThud, playHintSparkle, playWinFanfare } from './audio.js';
import { renderMarker, renderHintPulse, updateHud, showToast, showWinOverlay, hideWinOverlay } from './ui.js';

const els = {
  panelA: document.getElementById('panel-a'),
  panelB: document.getElementById('panel-b'),
  counter: document.getElementById('counter'),
  timerText: document.getElementById('timer-text'),
  timerFill: document.getElementById('timer-fill'),
  hintButton: document.getElementById('hint-btn'),
  restartButton: document.getElementById('restart-btn'),
  roundTitle: document.getElementById('round-title'),
  roundSubtitle: document.getElementById('round-subtitle'),
  score: document.getElementById('score'),
  foundList: document.getElementById('found-list'),
  toast: document.getElementById('toast'),
  winOverlay: document.getElementById('win-overlay'),
  winTitle: document.getElementById('win-title'),
  winDetail: document.getElementById('win-detail'),
  nextButton: document.getElementById('next-btn'),
  cursorA: document.getElementById('cursor-a'),
  cursorB: document.getElementById('cursor-b'),
};

const params = new URLSearchParams(location.search);
const frozenForShot = params.has('found') || params.has('complete') || params.has('hint');

const state = {
  roundIndex: 0,
  differences: [],
  found: new Set(),
  hintsLeft: 0,
  timeLimit: 0,
  timeLeft: 0,
  mistakes: 0,
  totalScore: 0,
  over: false,
  timerId: null,
  cursor: { x: 200, y: 150 },
};

function startRound(roundIndex) {
  const round = ROUNDS[roundIndex];
  state.roundIndex = roundIndex;
  state.differences = round.differences;
  state.found = new Set();
  state.hintsLeft = round.hintCount;
  state.timeLimit = round.timeLimit;
  state.timeLeft = round.timeLimit;
  state.mistakes = 0;
  state.over = false;
  const keys = new Set(round.differences.map((d) => d.key));
  els.panelA.querySelector('.scene').innerHTML = buildSceneSVG(roundIndex, 'A', keys, 'a');
  els.panelB.querySelector('.scene').innerHTML = buildSceneSVG(roundIndex, 'B', keys, 'b');
  els.panelA.querySelectorAll('.found-marker').forEach((m) => m.remove());
  els.panelB.querySelectorAll('.found-marker').forEach((m) => m.remove());
  els.roundTitle.textContent = round.name;
  els.roundSubtitle.textContent = round.subtitle;
  hideWinOverlay(els);
  applyScreenshotHooks(round);
  updateHud(els, state);
  updateScore();
  clearInterval(state.timerId);
  if (!frozenForShot) {
    state.timerId = setInterval(tickTimer, 250);
  }
}

// Deterministic hooks so screenshots (and curious players) can reproduce
// a set state: ?round=2&found=4 marks the first four differences,
// ?hint=1 pulses the next unfound one, ?complete=1 shows the win state.
function applyScreenshotHooks(round) {
  if (frozenForShot) state.timeLeft = round.timeLimit - 47;
  if (params.has('found')) {
    const n = Math.min(state.differences.length, Number(params.get('found')) || 0);
    for (let i = 0; i < n; i++) markFound(state.differences[i], false);
  }
  if (params.has('complete')) {
    for (const d of state.differences) markFound(d, false);
    state.over = true;
    showWin(state);
  }
  if (params.has('hint')) {
    const next = state.differences.find((d) => !state.found.has(d.key));
    if (next) renderHintPulse(next, [els.panelA, els.panelB]);
  }
}

function markFound(diff, celebrate = true) {
  if (state.found.has(diff.key)) return;
  state.found.add(diff.key);
  renderMarker(diff, els.panelA);
  renderMarker(diff, els.panelB);
  if (celebrate) playFoundChime(state.found.size);
}

function probe(sceneX, sceneY) {
  if (state.over) return;
  const hit = state.differences.find((d) => {
    if (state.found.has(d.key)) return false;
    const dx = sceneX - d.x;
    const dy = (sceneY - d.y) * 1.15;
    return Math.hypot(dx, dy) <= d.r;
  });
  if (hit) {
    markFound(hit);
    showToast(els, `Found it — ${hit.label}!`);
    if (state.found.size === state.differences.length) {
      state.over = true;
      playWinFanfare();
      showWin(state);
    }
  } else {
    state.mistakes += 1;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    playMissThud();
    showToast(els, 'Not there — 5 seconds slip away…');
  }
  updateHud(els, state);
  updateScore();
}

function showWin(s) {
  const isLast = s.roundIndex >= ROUNDS.length - 1;
  const roundScore = scoreForRound();
  showWinOverlay(els, {
    title: isLast ? '🏆 Harbour Master!' : '🎉 Round complete!',
    detail: `${s.differences.length} of ${s.differences.length} differences found with ${Math.ceil(s.timeLeft)}s to spare · ${s.mistakes} miss${s.mistakes === 1 ? '' : 'es'} · round score ${roundScore}`,
    nextLabel: isLast ? '↻ Play again from Round 1' : 'Next scene →',
  });
}

function scoreForRound() {
  return Math.max(0, state.found.size * 100 + Math.ceil(state.timeLeft) - state.mistakes * 25);
}

function updateScore() {
  els.score.textContent = `Score ${state.totalScore + (state.over ? 0 : scoreForRound())}`;
}

function tickTimer() {
  state.timeLeft = Math.max(0, state.timeLeft - 0.25);
  if (state.timeLeft <= 0 && !state.over) {
    state.over = true;
    clearInterval(state.timerId);
    showWinOverlay(els, {
      title: '⏰ Time’s up!',
      detail: `You found ${state.found.size} of ${state.differences.length}. The remaining differences are still hiding…`,
      nextLabel: '↻ Try this scene again',
    });
    els.nextButton.dataset.retry = '1';
  }
  updateHud(els, state);
}

function panelClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const sceneX = ((event.clientX - rect.left) / rect.width) * 400;
  const sceneY = ((event.clientY - rect.top) / rect.height) * 300;
  state.cursor = { x: sceneX, y: sceneY };
  moveCursor();
  probe(sceneX, sceneY);
}

function moveCursor() {
  for (const cursor of [els.cursorA, els.cursorB]) {
    cursor.style.left = `${(state.cursor.x / 400) * 100}%`;
    cursor.style.top = `${(state.cursor.y / 300) * 100}%`;
  }
}

function onKeyDown(event) {
  const step = event.shiftKey ? 20 : 8;
  const keys = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (keys[event.key]) {
    state.cursor.x = Math.min(400, Math.max(0, state.cursor.x + keys[event.key][0]));
    state.cursor.y = Math.min(300, Math.max(0, state.cursor.y + keys[event.key][1]));
    moveCursor();
    event.preventDefault();
  } else if (event.key === 'Enter' || event.key === ' ') {
    probe(state.cursor.x, state.cursor.y);
    event.preventDefault();
  } else if (event.key.toLowerCase() === 'h') {
    useHint();
  }
}

function useHint() {
  if (state.hintsLeft <= 0 || state.over) return;
  const next = state.differences.find((d) => !state.found.has(d.key));
  if (!next) return;
  state.hintsLeft -= 1;
  playHintSparkle();
  renderHintPulse(next, [els.panelA, els.panelB]);
  showToast(els, 'Something glimmers… look closely!');
  updateHud(els, state);
}

els.panelA.addEventListener('click', panelClick);
els.panelB.addEventListener('click', panelClick);
els.hintButton.addEventListener('click', useHint);
els.restartButton.addEventListener('click', () => startRound(state.roundIndex));
els.nextButton.addEventListener('click', () => {
  if (els.nextButton.dataset.retry === '1') {
    delete els.nextButton.dataset.retry;
    startRound(state.roundIndex);
  } else {
    state.totalScore += scoreForRound();
    startRound((state.roundIndex + 1) % ROUNDS.length);
  }
});
document.addEventListener('keydown', onKeyDown);

const startAt = Math.min(ROUNDS.length - 1, Math.max(0, (Number(params.get('round')) || 1) - 1));
moveCursor();
startRound(startAt);
