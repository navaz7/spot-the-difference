// scenes.js — draws the cosy lighthouse-café harbour scene as inline SVG.
// One builder renders both panels: panel A is the original, panel B passes
// the round's difference keys as "altered", and each conditional element
// below checks that set exactly once — so a difference can never drift
// between the data in differences.js and the picture on screen.

const PALETTES = {
  morning: { skyTop: '#7ec3ea', skyBot: '#e3f4fc', sea: '#3d90a8', seaDeep: '#2f7289', sun: '#ffd94d', hill: '#9dbf8e' },
  sunset: { skyTop: '#e88ca0', skyBot: '#ffd9a0', sea: '#4a7d9c', seaDeep: '#3a6480', sun: '#ff9d4d', hill: '#8a7f6e' },
  dawn: { skyTop: '#a8b8e8', skyBot: '#fdeeda', sea: '#4d93a0', seaDeep: '#3a7580', sun: '#ffe9a3', hill: '#93ac90' },
};

function gull(x, y, s) {
  return `<path d="M ${x - 9 * s} ${y} Q ${x - 4 * s} ${y - 6 * s} ${x} ${y} Q ${x + 4 * s} ${y - 6 * s} ${x + 9 * s} ${y}" fill="none" stroke="#3a4a56" stroke-width="2" stroke-linecap="round"/>`;
}

function cloud(x, y, s, fill) {
  return `<g fill="${fill}"><ellipse cx="${x}" cy="${y}" rx="${26 * s}" ry="${11 * s}"/><ellipse cx="${x - 16 * s}" cy="${y + 3 * s}" rx="${17 * s}" ry="${8 * s}"/><ellipse cx="${x + 17 * s}" cy="${y + 3 * s}" rx="${18 * s}" ry="${8 * s}"/></g>`;
}

function wave(x, y, w) {
  return `<path d="M ${x} ${y} q 6 -5 12 0 t 12 0 t 12 0 t 12 0" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round" transform="scale(${w / 48} 1) translate(${-x * (w / 48 - 1)} 0)"/>`;
}

export function buildSceneSVG(roundIndex, side, alteredKeys, uid) {
  const p = PALETTES[['morning', 'sunset', 'dawn'][roundIndex] || 'morning'];
  const alt = (key) => side === 'B' && alteredKeys.has(key);
  const stripeFill = alt('stripe') ? '#2a9d8f' : '#e63946';
  const sailFill = alt('sail') ? '#ffd94d' : '#fffaf0';
  const umbrellaFill = alt('umbrella') ? '#8b5fbf' : '#ff7f51';
  const doorFill = alt('door') ? '#c0392b' : '#2a7f7f';
  const signFill = alt('signboard') ? '#bfe3c8' : '#fff3d6';
  const keeperWindow = alt('window') ? '#5a6b7a' : '#ffca3a';
  const lampGlow = alt('lamp') ? '' : `<circle cx="52" cy="60" r="17" fill="#ffe66d" opacity="0.45"/><circle cx="52" cy="60" r="9" fill="#ffe66d"/>`;
  const lampCore = alt('lamp') ? '#8a97a3' : '#fff3b0';
  const porthole = alt('porthole') ? '#40536b' : '#ffca3a';
  const lanternFill = alt('lantern') ? '#6b7a89' : '#ffb703';
  const clockHands = alt('clock')
    ? '<line x1="306" y1="158" x2="306" y2="150" stroke="#333" stroke-width="2"/><line x1="306" y1="158" x2="313" y2="158" stroke="#333" stroke-width="2"/>'
    : '<line x1="306" y1="158" x2="300" y2="152" stroke="#333" stroke-width="2"/><line x1="306" y1="158" x2="306" y2="165" stroke="#333" stroke-width="2"/>';
  const catTail = alt('tail')
    ? '<path d="M 158 236 q 10 2 12 -6" fill="none" stroke="#4a3728" stroke-width="3" stroke-linecap="round"/>'
    : '<path d="M 158 236 q 12 -2 10 -14" fill="none" stroke="#4a3728" stroke-width="3" stroke-linecap="round"/>';

  return `
<svg viewBox="0 0 400 300" role="img" aria-label="Harbour scene, panel ${side}" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.skyTop}"/><stop offset="1" stop-color="${p.skyBot}"/>
    </linearGradient>
    <linearGradient id="sea-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sea}"/><stop offset="1" stop-color="${p.seaDeep}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="196" fill="url(#sky-${uid})"/>
  <circle cx="338" cy="46" r="24" fill="${p.sun}"/>
  <circle cx="338" cy="46" r="30" fill="${p.sun}" opacity="0.25"/>
  ${cloud(70, 34, 1, '#ffffff')}
  ${cloud(190, 58, 0.8, '#ffffff')}
  ${alt('cloud') ? '' : cloud(356, 28, 0.62, '#ffffff')}
  ${gull(150, 44, 1)}${gull(238, 30, 0.8)}
  ${alt('gull') ? '' : gull(302, 40, 0.9)}
  <path d="M0 196 L70 168 L140 190 L210 172 L400 196 L400 210 L0 210 Z" fill="${p.hill}"/>
  <rect y="192" width="400" height="42" fill="url(#sea-${uid})"/>
  ${wave(30, 214, 48)}${wave(120, 228, 48)}${wave(300, 232, 48)}${wave(210, 208, 48)}
  ${alt('buoy') ? '' : '<g><path d="M150 204 l8 -12 l8 12 z" fill="#e63946"/><rect x="156" y="188" width="4" height="6" fill="#333"/></g>'}
  ${alt('fish') ? '' : '<path d="M232 226 q10 -14 20 -4 q-8 2 -10 6 q-4 -4 -10 -2z" fill="#f4a261"/><circle cx="238" cy="220" r="1.6" fill="#333"/>'}

  <!-- lighthouse -->
  ${alt('topflag') ? '' : '<path d="M54 14 l16 4 l-16 5 z" fill="#e63946"/>'}
  <rect x="52" y="12" width="3" height="18" fill="#5a4632"/>
  <rect x="38" y="34" width="30" height="8" rx="3" fill="#40536b"/>
  ${lampGlow}<rect x="44" y="42" width="18" height="20" rx="3" fill="${lampCore}" stroke="#40536b" stroke-width="2"/>
  <path d="M36 32 L53 18 L70 32 Z" fill="#c0392b"/>
  <rect x="34" y="62" width="38" height="6" fill="#40536b"/>
  ${alt('perchgull') ? '' : gull(72, 70, 0.55)}
  <path d="M40 68 L66 68 L70 150 L36 150 Z" fill="#fffaf0"/>
  <path d="M38 92 L68 92 L69 108 L37 108 Z" fill="${stripeFill}"/>
  <path d="M36 122 L70 122 L71 138 L35 138 Z" fill="${stripeFill}"/>
  <circle cx="52" cy="152" r="5" fill="${porthole}" stroke="#40536b" stroke-width="1.6"/>
  <path d="M36 150 L70 150 L74 196 L32 196 Z" fill="#fffaf0"/>
  <rect x="46" y="172" width="13" height="24" rx="5" fill="#7a4a2b"/>

  <!-- keeper's house -->
  ${alt('smoke') ? '' : '<g fill="#ffffff" opacity="0.85"><circle cx="114" cy="146" r="5"/><circle cx="120" cy="138" r="7"/><circle cx="128" cy="129" r="9"/></g>'}
  <rect x="108" y="150" width="9" height="16" fill="#8a5a3b"/>
  <rect x="86" y="176" width="56" height="34" fill="#f6e3c5"/>
  <path d="M80 178 L114 160 L148 178 Z" fill="#b5533c"/>
  <rect x="102" y="186" width="13" height="13" fill="${keeperWindow}" stroke="#7a4a2b" stroke-width="2"/>
  <rect x="124" y="188" width="11" height="22" fill="#7a4a2b"/>

  <!-- bunting from lighthouse to café -->
  <path d="M70 44 Q 190 84 292 52" fill="none" stroke="#5a4632" stroke-width="1.6"/>
  <g stroke="#5a4632" stroke-width="0.8">
    <path d="M110 56 l7 12 l7 -11 z" fill="#e63946"/><path d="M150 64 l7 12 l7 -11 z" fill="#ffd94d"/>
    <path d="M192 68 l7 12 l7 -11 z" fill="#2a9d8f"/><path d="M232 66 l7 12 l7 -11 z" fill="#4361ee"/>
    <path d="M246 62 l6 11 l7 -10 z" fill="${alt('bunting') ? '#ff8c42' : '#57a773'}"/>
  </g>

  <!-- sailboat -->
  <rect x="200" y="104" width="3.5" height="100" fill="#5a4632"/>
  <path d="M196 112 L196 168 L172 168 Z" fill="${sailFill}" stroke="#d8cfc0" stroke-width="1.4"/>
  <path d="M208 122 L208 168 L232 168 Z" fill="#fdfdfd" stroke="#d8cfc0" stroke-width="1.4"/>
  ${alt('sailstripe') ? '' : '<path d="M182 158 L196 158 L196 166 L186 166 Z" fill="#e63946"/>'}
  <path d="M164 204 L244 204 L234 220 L174 220 Z" fill="#b5533c"/>
  <rect x="164" y="200" width="80" height="5" fill="#7a4a2b"/>

  <!-- rowboat -->
  ${alt('boatflag') ? '' : '<rect x="298" y="182" width="2.6" height="15" fill="#5a4632"/><path d="M301 182 l11 3 l-11 4 z" fill="#2a9d8f"/>'}
  <path d="M262 210 L322 210 L312 224 L272 224 Z" fill="#2a7f7f"/>
  <circle cx="284" cy="204" r="6" fill="#f4a261"/><path d="M278 210 q6 -8 12 0 l0 4 l-12 0z" fill="#4361ee"/>

  <!-- café on the quay -->
  <rect x="286" y="148" width="100" height="66" fill="#fdf6e9"/>
  <path d="M280 150 L336 128 L392 150 Z" fill="#c0392b"/>
  <rect x="300" y="150" width="66" height="15" rx="3" fill="${signFill}" stroke="#7a4a2b" stroke-width="1.6"/>
  <text x="333" y="161.5" text-anchor="middle" font-family="Georgia, serif" font-size="10.5" font-weight="bold" fill="#7a2d20">CAFÉ</text>
  <circle cx="306" cy="158" r="0.1" fill="none"/>
  <g><circle cx="306" cy="176" r="9" fill="#fffdf5" stroke="#7a4a2b" stroke-width="1.6"/>${clockHands}</g>
  <rect x="356" y="168" width="7" height="14" fill="${lanternFill}" stroke="#5a4632" stroke-width="1.4"/>
  ${alt('plant') ? '' : '<g><path d="M298 166 q-2 8 -6 10 M298 166 q2 9 7 11 M298 166 l0 12" stroke="#2e7d32" stroke-width="2" fill="none"/><rect x="293" y="160" width="10" height="7" rx="2" fill="#b5533c"/></g>'}
  <rect x="322" y="186" width="20" height="28" rx="8" fill="${doorFill}"/>
  <rect x="292" y="172" width="17" height="15" fill="#ffe9a3" stroke="#7a4a2b" stroke-width="1.6"/>
  <rect x="352" y="172" width="17" height="15" fill="#ffe9a3" stroke="#7a4a2b" stroke-width="1.6"/>

  <!-- café terrace: umbrella, tables, cups -->
  <path d="M278 164 L254 192 L302 192 Z" fill="${umbrellaFill}"/>
  <rect x="276.5" y="180" width="3" height="32" fill="#5a4632"/>
  <ellipse cx="290" cy="216" rx="15" ry="4.5" fill="#fffdf5" stroke="#cbb"/>
  <rect x="288.5" y="216" width="3" height="14" fill="#5a4632"/>
  ${alt('cup') ? '' : '<g><rect x="285" y="208" width="8" height="6" rx="1.5" fill="#e63946"/><path d="M293 210 q5 1 0 4" fill="none" stroke="#e63946" stroke-width="1.4"/></g>'}
  <ellipse cx="352" cy="220" rx="13" ry="4" fill="#fffdf5" stroke="#cbb"/>
  <rect x="350.5" y="220" width="3" height="12" fill="#5a4632"/>

  <!-- quay, wall, sand -->
  <rect y="232" width="400" height="14" fill="#a08b72"/>
  <rect y="246" width="400" height="54" fill="#f2d492"/>
  ${alt('anchor') ? '' : '<g stroke="#40536b" stroke-width="3" fill="none"><path d="M186 210 v18 M178 220 q8 10 16 0 M181 213 h10"/></g>'}
  ${alt('cat') ? '' : `<g transform="translate(0 -7)"><ellipse cx="146" cy="232" rx="11" ry="7" fill="#4a3728"/><circle cx="137" cy="226" r="6" fill="#4a3728"/><path d="M133 222 l-2 -5 l5 3 M141 222 l2 -5 l-5 3" fill="#4a3728"/>${catTail}<circle cx="135" cy="226" r="1.2" fill="#ffd94d"/><circle cx="140" cy="226" r="1.2" fill="#ffd94d"/></g>`}
  ${alt('starfish') ? '' : '<path d="M88 262 l3.5 7 l7.7 1 l-5.6 5.4 l1.3 7.6 l-6.9 -3.6 l-6.9 3.6 l1.3 -7.6 l-5.6 -5.4 l7.7 -1z" fill="#ff8c42"/>'}
  ${alt('crab') ? '' : '<g fill="#e63946"><ellipse cx="350" cy="276" rx="8" ry="5.5"/><circle cx="340" cy="268" r="3.4"/><circle cx="360" cy="268" r="3.4"/><circle cx="346" cy="272" r="1.2" fill="#fff"/><circle cx="354" cy="272" r="1.2" fill="#fff"/></g>'}
  ${alt('shell') ? '' : '<path d="M192 280 a8 7 0 0 1 16 0 z" fill="#f7a8b8" stroke="#d16a7e" stroke-width="1.2"/>'}
  ${alt('rope') ? '' : '<g fill="none" stroke="#b08954" stroke-width="3"><circle cx="264" cy="244" r="8"/><circle cx="264" cy="244" r="4"/></g>'}
  <g><rect x="240" y="248" width="16" height="12" rx="2" fill="#b5533c"/><circle cx="246" cy="252" r="2.6" fill="#e63946"/><circle cx="252" cy="250" r="2.6" fill="#ffd94d"/>${alt('flower') ? '<circle cx="248" cy="246" r="2.8" fill="#ff5d8f"/>' : ''}</g>
  <g fill="#57a773"><path d="M20 282 q3 -12 8 -14 q1 10 -3 15z"/><path d="M380 288 q3 -12 8 -14 q1 10 -3 15z"/><path d="M28 288 q6 -9 12 -9 q-2 8 -8 11z"/></g>
</svg>`;
}
