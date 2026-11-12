// ─── FloatingDoodles ───
// SVG hand-drawn doodle elements that float around sections.

import React from 'react';
import { motion } from 'framer-motion';

const doodleVariants = {
  float: {
    y: [0, -12, 0],
    rotate: [-3, 3, -3],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Star doodle
function Star({ size = 24, color = '#F5DF8B', style }) {
  return (
    <motion.div variants={doodleVariants} animate="float" style={style} className="pointer-events-none absolute">
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
      </svg>
    </motion.div>
  );
}

// Squiggle doodle
function Squiggle({ color = '#A8B99A', style }) {
  return (
    <motion.div
      variants={doodleVariants}
      animate={{ ...doodleVariants.float, y: [0, -8, 0] }}
      style={style}
      className="pointer-events-none absolute"
    >
      <svg width="60" height="20" viewBox="0 0 60 20" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
        <path d="M2,10 Q10,2 18,10 Q26,18 34,10 Q42,2 50,10 Q58,18 60,10" />
      </svg>
    </motion.div>
  );
}

// Cross/plus doodle
function Cross({ size = 20, color = '#34382F', style }) {
  return (
    <motion.div
      animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={style}
      className="pointer-events-none absolute"
    >
      <svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
        <rect x="8" y="2" width="4" height="16" rx="2" />
        <rect x="2" y="8" width="16" height="4" rx="2" />
      </svg>
    </motion.div>
  );
}

// Dot cluster
function Dots({ color = '#A8B99A', style }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      style={style}
      className="pointer-events-none absolute"
    >
      <svg width="40" height="20" viewBox="0 0 40 20">
        {[0, 14, 28].map((x, i) => (
          <circle key={i} cx={x + 6} cy="10" r="4" fill={color} opacity={0.6 + i * 0.15} />
        ))}
      </svg>
    </motion.div>
  );
}

// Arrow doodle
function Arrow({ color = '#34382F', style }) {
  return (
    <motion.div
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={style}
      className="pointer-events-none absolute"
    >
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4,10 Q20,10 30,10" />
        <path d="M22,4 L30,10 L22,16" />
      </svg>
    </motion.div>
  );
}

// Spiral doodle
function Spiral({ color = '#A8B99A', style }) {
  return (
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      style={style}
      className="pointer-events-none absolute opacity-40"
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M15,15 m0,-6 a6,6 0 0,1 6,6 a9,9 0 0,1 -9,9 a12,12 0 0,1 -12,-12 a15,15 0 0,1 15,-15" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

// Main component - renders a random set of doodles
export function FloatingDoodles({ section = 'default' }) {
  // Different configurations per section
  const configs = {
    default: [
      <Star key="s1" size={20} color="#F5DF8B" style={{ top: '5%', right: '8%' }} />,
      <Squiggle key="sq1" color="#A8B99A" style={{ top: '15%', left: '4%' }} />,
      <Cross key="c1" size={16} color="#34382F" style={{ bottom: '20%', right: '12%' }} />,
      <Dots key="d1" color="#A8B99A" style={{ bottom: '10%', left: '6%' }} />,
    ],
    landing: [
      <Star key="s1" size={28} color="#F5DF8B" style={{ top: '8%', right: '6%' }} />,
      <Star key="s2" size={16} color="#A8B99A" style={{ top: '20%', left: '5%' }} />,
      <Squiggle key="sq1" color="#A8B99A" style={{ bottom: '30%', right: '4%' }} />,
      <Arrow key="a1" color="#34382F" style={{ bottom: '15%', left: '8%', transform: 'rotate(30deg)' }} />,
      <Spiral key="sp1" color="#A8B99A" style={{ top: '50%', right: '3%' }} />,
    ],
    roast: [
      <Star key="s1" size={22} color="#F5DF8B" style={{ top: '5%', left: '5%' }} />,
      <Cross key="c1" size={18} color="#A8B99A" style={{ top: '10%', right: '6%' }} />,
      <Dots key="d1" color="#F5DF8B" style={{ bottom: '15%', right: '8%' }} />,
      <Squiggle key="sq1" color="#34382F" style={{ bottom: '5%', left: '4%' }} />,
    ],
    gallery: [
      <Star key="s1" size={18} color="#F5DF8B" style={{ top: '3%', right: '5%' }} />,
      <Star key="s2" size={12} color="#A8B99A" style={{ top: '45%', left: '3%' }} />,
      <Arrow key="a1" color="#34382F" style={{ bottom: '20%', right: '6%', transform: 'rotate(-45deg)' }} />,
    ],
    lily: [
      <Squiggle key="sq1" color="#A8B99A" style={{ top: '5%', left: '5%' }} />,
      <Star key="s1" size={24} color="#F5DF8B" style={{ top: '10%', right: '5%' }} />,
      <Spiral key="sp1" color="#A8B99A" style={{ bottom: '20%', left: '4%' }} />,
      <Dots key="d1" color="#A8B99A" style={{ bottom: '10%', right: '6%' }} />,
    ],
  };

  const doodles = configs[section] || configs.default;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {doodles}
    </div>
  );
}

export default FloatingDoodles;
