// ui.js — everything the player sees around the two pictures: the HUD
// (found counter, timer bar, hint button), the ring markers dropped on
// found differences, the hint pulse, the toast line and the win overlay.

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function renderMarker(diff, panelEl) {
  const marker = document.createElement('div');
  marker.className = 'found-marker';
  marker.style.left = `${(diff.x / 400) * 100}%`;
  marker.style.top = `${(diff.y / 300) * 100}%`;
  marker.style.width = `${(diff.r * 2 / 400) * 100}%`;
  marker.setAttribute('aria-hidden', 'true');
  panelEl.appendChild(marker);
  return marker;
}

export function renderHintPulse(diff, panelEls) {
  for (const panelEl of panelEls) {
    const pulse = document.createElement('div');
    pulse.className = 'hint-pulse';
    pulse.style.left = `${(diff.x / 400) * 100}%`;
    pulse.style.top = `${(diff.y / 300) * 100}%`;
    panelEl.appendChild(pulse);
    setTimeout(() => pulse.remove(), 2600);
  }
}

export function updateHud(els, state) {
  const found = state.found.size;
  const total = state.differences.length;
  els.counter.textContent = `${found} of ${total} found · ${total - found} remain`;
  els.hintButton.textContent = `💡 Hint (${state.hintsLeft} left)`;
  els.hintButton.disabled = state.hintsLeft <= 0 || found === total;
  els.timerText.textContent = formatTime(state.timeLeft);
  const frac = Math.max(0, state.timeLeft / state.timeLimit);
  els.timerFill.style.width = `${frac * 100}%`;
  els.timerFill.classList.toggle('low', frac < 0.25);
  els.foundList.innerHTML = state.differences
    .filter((d) => state.found.has(d.key))
    .map((d) => `<li>✓ ${d.label}</li>`)
    .join('');
}

let toastTimer = null;
export function showToast(els, message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800);
}

export function showWinOverlay(els, { title, detail, nextLabel }) {
  els.winTitle.textContent = title;
  els.winDetail.textContent = detail;
  els.nextButton.textContent = nextLabel;
  els.winOverlay.classList.add('show');
}

export function hideWinOverlay(els) {
  els.winOverlay.classList.remove('show');
}
