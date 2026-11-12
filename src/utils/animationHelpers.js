// ─── Animation Helpers ───

/**
 * Returns a random number between min and max.
 */
export const randomBetween = (min, max) => Math.random() * (max - min) + min;

/**
 * Returns a random integer between min and max (inclusive).
 */
export const randomInt = (min, max) => Math.floor(randomBetween(min, max + 1));

/**
 * Creates an array of petal configs for the burst animation.
 * @param {number} count
 */
export function createPetalBurst(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(10, 90), // vw percentage
    delay: randomBetween(0, 1.5),
    duration: randomBetween(3, 5),
    size: randomBetween(8, 20),
    rotation: randomBetween(0, 360),
    color: i % 3 === 0 ? '#fff' : i % 3 === 1 ? '#F5DF8B' : '#A8B99A',
  }));
}

/**
 * Creates an array of confetti configs.
 * @param {number} count
 */
export function createConfetti(count = 30) {
  const colors = ['#F5DF8B', '#A8B99A', '#34382F', '#fff', '#F7F6EF'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(20, 80),
    y: randomBetween(20, 60),
    delay: randomBetween(0, 0.8),
    duration: randomBetween(0.6, 1.2),
    color: colors[i % colors.length],
    size: randomBetween(6, 14),
    rotate: randomBetween(0, 360),
  }));
}

/**
 * Stagger delay helper for Framer Motion.
 * @param {number} index
 * @param {number} baseDelay
 */
export const stagger = (index, baseDelay = 0.1) => index * baseDelay;

/**
 * Checks if the user prefers reduced motion.
 */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Clamps a value between min and max.
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Lerp (linear interpolation) between two values.
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Smooth a position toward a target (for hand tracking smoothing).
 */
export function smoothPosition(current, target, factor = 0.15) {
  return {
    x: lerp(current.x, target.x, factor),
    y: lerp(current.y, target.y, factor),
  };
}
