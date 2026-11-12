import test from 'node:test';
import assert from 'node:assert/strict';
import { detectOpenPalm, getHandGuidanceText, getPalmCenter } from '../src/utils/handTracking.js';
import { birthdayContent } from '../src/data/birthdayContent.js';

const fingerLandmarks = [
  { mcp: 5, pip: 6, tip: 8, base: [0.35, 0.55], openPip: [0.32, 0.42], openTip: [0.30, 0.29], fistPip: [0.41, 0.54], fistTip: [0.48, 0.53] },
  { mcp: 9, pip: 10, tip: 12, base: [0.45, 0.50], openPip: [0.45, 0.35], openTip: [0.45, 0.18], fistPip: [0.49, 0.53], fistTip: [0.52, 0.53] },
  { mcp: 13, pip: 14, tip: 16, base: [0.55, 0.50], openPip: [0.58, 0.36], openTip: [0.61, 0.22], fistPip: [0.55, 0.54], fistTip: [0.52, 0.54] },
  { mcp: 17, pip: 18, tip: 20, base: [0.65, 0.55], openPip: [0.69, 0.43], openTip: [0.74, 0.34], fistPip: [0.59, 0.55], fistTip: [0.53, 0.53] },
];

function makeHand({ open, mirrored = false }) {
  const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5 }));
  landmarks[0] = { x: 0.98, y: 0.02 };

  for (const finger of fingerLandmarks) {
    const positions = open
      ? [finger.base, finger.openPip, finger.openTip]
      : [finger.base, finger.fistPip, finger.fistTip];
    [finger.mcp, finger.pip, finger.tip].forEach((index, position) => {
      const [x, y] = positions[position];
      landmarks[index] = { x: mirrored ? 1 - x : x, y };
    });
  }

  return landmarks;
}

test('open palm is detected for either mirrored hand orientation', () => {
  assert.equal(detectOpenPalm(makeHand({ open: true }), 4 / 3), true);
  assert.equal(detectOpenPalm(makeHand({ open: true, mirrored: true }), 4 / 3), true);
});

test('closed fist and missing landmarks are not detected as an open palm', () => {
  assert.equal(detectOpenPalm(makeHand({ open: false }), 4 / 3), false);
  assert.equal(detectOpenPalm(null), false);
  assert.equal(detectOpenPalm([]), false);
});

test('palm center is the average of MCP landmarks and ignores the wrist', () => {
  const landmarks = makeHand({ open: true });
  assert.deepEqual(getPalmCenter(landmarks), { x: 0.5, y: 0.525 });
});

test('guidance changes for startup, no hand, closed palm, and open palm states', () => {
  const { camera } = birthdayContent;

  assert.equal(getHandGuidanceText(false, null, camera), '✋ Show your open palm to the camera');
  assert.equal(getHandGuidanceText(true, null, camera), 'Bring your hand into the camera frame 👋');
  assert.equal(getHandGuidanceText(true, { isOpen: false }, camera), 'Open your palm to reveal the birthday surprise ✋');
  assert.equal(getHandGuidanceText(true, { isOpen: true }, camera), '✨ Perfect! Keep your palm open!');
});
