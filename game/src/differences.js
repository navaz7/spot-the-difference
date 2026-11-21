// differences.js — the data for every round of Spot the Difference.
// Each difference is defined once: where it sits in the 400x300 scene
// (x, y, r = forgiving click radius), a short label shown in the found
// list, and a `key` the scene builder uses to draw panel A (original)
// versus panel B (altered). Rounds rise in difficulty: smaller radii,
// subtler changes, less time.

export const ROUNDS = [
  {
    name: 'Morning at Gullwing Harbour',
    subtitle: 'Round 1 · a gentle warm-up',
    timeLimit: 240,
    hintCount: 3,
    palette: 'morning',
    differences: [
      { key: 'stripe', label: 'Lighthouse stripe colour', x: 52, y: 122, r: 22 },
      { key: 'cat', label: 'Cat on the harbour wall', x: 148, y: 224, r: 20 },
      { key: 'gull', label: 'A missing seagull', x: 302, y: 40, r: 20 },
      { key: 'umbrella', label: 'Café umbrella colour', x: 278, y: 180, r: 21 },
      { key: 'sail', label: 'Sailboat sail colour', x: 203, y: 148, r: 22 },
      { key: 'cloud', label: 'A vanished cloud', x: 356, y: 28, r: 20 },
      { key: 'bunting', label: 'One bunting flag changed', x: 252, y: 66, r: 18 },
      { key: 'window', label: 'Keeper’s window light', x: 108, y: 192, r: 18 },
      { key: 'starfish', label: 'Starfish on the sand', x: 88, y: 272, r: 19 },
      { key: 'topflag', label: 'Lighthouse flag', x: 54, y: 26, r: 18 },
    ],
  },
  {
    name: 'Sunset Service at the Café',
    subtitle: 'Round 2 · the light is trickier now',
    timeLimit: 210,
    hintCount: 3,
    palette: 'sunset',
    differences: [
      { key: 'lamp', label: 'Lighthouse lamp glow', x: 52, y: 60, r: 19 },
      { key: 'crab', label: 'Crab on the sand', x: 350, y: 274, r: 17 },
      { key: 'boatflag', label: 'Rowboat flag', x: 300, y: 196, r: 17 },
      { key: 'anchor', label: 'Anchor on the harbour wall', x: 186, y: 224, r: 17 },
      { key: 'cup', label: 'A missing coffee cup', x: 290, y: 214, r: 16 },
      { key: 'door', label: 'Café door colour', x: 332, y: 200, r: 18 },
      { key: 'perchgull', label: 'Gull on the lighthouse rail', x: 72, y: 70, r: 16 },
      { key: 'flower', label: 'Extra flower in the pot', x: 248, y: 256, r: 16 },
      { key: 'sailstripe', label: 'Stripe on the sail', x: 189, y: 162, r: 17 },
      { key: 'signboard', label: 'Café sign colour', x: 332, y: 158, r: 18 },
    ],
  },
  {
    name: 'First Light, Last Orders',
    subtitle: 'Round 3 · small things, sharp eyes',
    timeLimit: 180,
    hintCount: 2,
    palette: 'dawn',
    differences: [
      { key: 'smoke', label: 'Chimney smoke', x: 114, y: 148, r: 15 },
      { key: 'buoy', label: 'Buoy in the water', x: 158, y: 204, r: 15 },
      { key: 'fish', label: 'A leaping fish', x: 242, y: 222, r: 15 },
      { key: 'lantern', label: 'Café lantern light', x: 360, y: 175, r: 14 },
      { key: 'tail', label: 'The cat’s tail moved', x: 160, y: 218, r: 14 },
      { key: 'clock', label: 'The café clock hands', x: 306, y: 176, r: 14 },
      { key: 'shell', label: 'Shell on the sand', x: 200, y: 278, r: 14 },
      { key: 'rope', label: 'Coil of rope by the boats', x: 264, y: 242, r: 15 },
      { key: 'porthole', label: 'Lighthouse porthole light', x: 52, y: 152, r: 14 },
      { key: 'plant', label: 'Hanging plant at the café', x: 298, y: 170, r: 14 },
    ],
  },
];

export function differencesForRound(roundIndex) {
  return ROUNDS[roundIndex].differences;
}
