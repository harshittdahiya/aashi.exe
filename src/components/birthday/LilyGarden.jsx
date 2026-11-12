// ─── LilyGarden ───
// Section 5: Interactive lily SVG garden — tap to bloom and reveal messages.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import SectionHeading from '../common/SectionHeading';
import FloatingPetals from '../common/FloatingPetals';
import { FloatingDoodles } from '../common/FloatingDoodles';

const { lilyGarden } = birthdayContent;

// Lily petal component - animated bloom
function LilyPetal({ angle, bloomed, delay }) {
  return (
    <motion.ellipse
      cx="50"
      cy="50"
      rx="8"
      ry="22"
      fill="white"
      stroke="#E8E5D8"
      strokeWidth="1"
      style={{ transformOrigin: '50px 50px' }}
      transform={`rotate(${angle} 50 50) translate(0 -16)`}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={bloomed ? { scaleY: 1, opacity: 1 } : { scaleY: 0.3, opacity: 0.6 }}
      transition={{ duration: 0.4, delay: delay, type: 'spring', stiffness: 200 }}
    />
  );
}

// Full lily illustration
function LilySVG({ bloomed, size = 100 }) {
  const petalAngles = [0, 60, 120, 180, 240, 300];

  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" fill="none">
      {/* Stem */}
      <motion.path
        d="M50,140 Q46,110 50,85"
        stroke="#A8B99A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={bloomed ? { stroke: '#7a9068' } : { stroke: '#A8B99A' }}
      />
      {/* Leaves */}
      <path d="M48,120 Q32,105 36,96" stroke="#A8B99A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M52,110 Q68,96 64,88" stroke="#A8B99A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Petals */}
      {petalAngles.map((angle, i) => (
        <LilyPetal key={i} angle={angle} bloomed={bloomed} delay={i * 0.05} />
      ))}

      {/* Center */}
      <motion.circle
        cx="50"
        cy="50"
        r="7"
        fill="#F5DF8B"
        animate={bloomed ? { r: 9, fill: '#e8c94a' } : { r: 7 }}
        transition={{ delay: 0.3 }}
      />

      {/* Stamens (shown when bloomed) */}
      <AnimatePresence>
        {bloomed && [0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.circle
            key={i}
            cx={50 + 14 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 14 * Math.sin((angle * Math.PI) / 180)}
            r="2"
            fill="#F5DF8B"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
}

// Single interactive lily
function InteractiveLily({ index, message, totalLilies }) {
  const [bloomed, setBloomed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [petalBurst, setPetalBurst] = useState(false);

  // Stagger positions for natural garden look
  const positions = [
    { x: 10, size: 85, rotate: -8 },
    { x: 55, size: 100, rotate: 3 },
    { x: 25, size: 75, rotate: -4 },
    { x: 65, size: 95, rotate: 6 },
    { x: 5, size: 90, rotate: -6 },
    { x: 45, size: 80, rotate: 2 },
    { x: 70, size: 85, rotate: -3 },
  ];
  const pos = positions[index % positions.length];

  const handleTap = () => {
    if (!bloomed) {
      setBloomed(true);
      setPetalBurst(true);
      setTimeout(() => {
        setShowMessage(true);
        setPetalBurst(false);
      }, 500);
    } else {
      setBloomed(false);
      setShowMessage(false);
    }
  };

  return (
    <div className="relative">
      <FloatingPetals trigger={petalBurst} count={10} />

      <motion.div
        className="cursor-pointer inline-block"
        style={{ marginLeft: `${pos.x % 30}%`, transform: `rotate(${pos.rotate}deg)` }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        animate={bloomed ? { scale: 1.05 } : { scale: 1 }}
        whileHover={{ scale: 1.08 }}
      >
        <LilySVG bloomed={bloomed} size={pos.size} />
      </motion.div>

      {/* Message tooltip */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="absolute z-20 max-w-[200px] left-1/2"
            style={{ transform: 'translateX(-50%)', bottom: '100%', marginBottom: '8px' }}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-ink text-off-white rounded-2xl px-4 py-3 shadow-lg relative">
              <p className="font-handwritten text-sm text-center">{message}</p>
              {/* Arrow */}
              <div
                className="absolute left-1/2 w-3 h-3 bg-ink rotate-45"
                style={{ bottom: '-6px', transform: 'translateX(-50%) rotate(45deg)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LilyGarden() {
  const [allBloomed, setAllBloomed] = useState(false);
  const messages = lilyGarden.messages;

  return (
    <section
      id="lily-garden"
      className="relative py-16 px-5 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #EEF2E9 0%, #F7F6EF 100%)' }}
    >
      <FloatingDoodles section="lily" />

      <div className="max-w-sm mx-auto relative z-10">
        <SectionHeading
          label="🌸 Garden"
          title={lilyGarden.heading}
          subtitle={lilyGarden.subheading}
        />

        {/* Garden bed */}
        <div className="relative min-h-[320px] mb-6">
          {/* Ground line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 rounded-b-3xl"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(168,185,154,0.3))' }}
          />
          <svg
            className="absolute bottom-0 left-0 right-0 w-full"
            height="20"
            viewBox="0 0 400 20"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M0,10 Q50,2 100,10 Q150,18 200,10 Q250,2 300,10 Q350,18 400,10 L400,20 L0,20 Z"
              fill="#A8B99A" fillOpacity="0.25" />
          </svg>

          {/* Lilies in a row */}
          <div className="flex items-end justify-around px-2 pb-6">
            {messages.map((msg, i) => (
              <InteractiveLily key={i} index={i} message={msg} totalLilies={messages.length} />
            ))}
          </div>
        </div>

        {/* Instruction */}
        <motion.p
          className="font-handwritten text-base text-secondary text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          🌸 Tap each lily to bloom it
        </motion.p>
      </div>
    </section>
  );
}

export default LilyGarden;
