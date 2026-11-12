// ─── FloatingPetals ───
// Renders animated white lily petals that float across the screen.

import React, { useState, useEffect } from 'react';
import { createPetalBurst } from '../../utils/animationHelpers';

function Petal({ x, delay, duration, size, color, rotation }) {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x}vw`,
        top: '-30px',
        width: `${size}px`,
        height: `${size}px`,
        animationName: 'petalFall',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: 'ease-in',
        animationFillMode: 'forwards',
      }}
    >
      {/* Lily petal shape */}
      <svg viewBox="0 0 24 24" fill={color} style={{ transform: `rotate(${rotation}deg)`, opacity: 0.85 }}>
        <ellipse cx="12" cy="12" rx="6" ry="10" />
        <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(120 12 12)" />
      </svg>
    </div>
  );
}

function FloatingPetals({ trigger, count = 20 }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newPetals = createPetalBurst(count);
      setPetals(newPetals);

      // Clear after animations complete
      const timer = setTimeout(() => setPetals([]), (count * 0.1 + 5) * 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, count]);

  return (
    <>
      {petals.map(p => (
        <Petal key={p.id} {...p} />
      ))}
    </>
  );
}

// Continuous ambient petals (slower, fewer)
export function AmbientPetals() {
  const [wave, setWave] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWave(w => w + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return <FloatingPetals trigger={wave > 0} count={8} />;
}

export default FloatingPetals;
