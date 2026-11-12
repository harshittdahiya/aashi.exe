// ─── BirthdayReveal ───
// First section after unlock — animated heading with floating petals.

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import FloatingPetals, { AmbientPetals } from '../common/FloatingPetals';
import { FloatingDoodles } from '../common/FloatingDoodles';

const { reveal } = birthdayContent;

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotate: -5 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  }),
};

function BirthdayReveal({ onScrollNext }) {
  const [petalBurst, setPetalBurst] = useState(false);
  const words = reveal.mainHeading.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => setPetalBurst(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="reveal"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-5 py-16"
      style={{ background: 'linear-gradient(180deg, #F7F6EF 0%, #EEF2E9 100%)' }}
    >
      <AmbientPetals />
      <FloatingPetals trigger={petalBurst} count={24} />
      <FloatingDoodles section="default" />

      {/* Animated heading words */}
      <motion.div className="text-center mb-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-4">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="font-display text-3xl sm:text-4xl text-ink block"
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Cake emoji burst */}
        <motion.div
          className="text-6xl my-6"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.8 }}
        >
          🎂
        </motion.div>

        <motion.p
          className="font-handwritten text-xl text-secondary max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {reveal.subtext}
        </motion.p>
      </motion.div>

      {/* Sticker badges */}
      <motion.div
        className="flex gap-3 flex-wrap justify-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {['🎉 IT HAPPENED', '📅 ANNUAL EVENT', '✨ CERTIFIED', '🌸 FANCY'].map((s, i) => (
          <motion.span
            key={s}
            className="sticker text-sm"
            style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (i + 1) * 2}deg)` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.6 + i * 0.1, type: 'spring' }}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>

      {/* Scroll down button */}
      <motion.button
        onClick={onScrollNext}
        className="flex flex-col items-center gap-2 text-secondary group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-label="Scroll to next section"
      >
        <span className="font-handwritten text-sm">scroll for more chaos</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-8 border-2 border-secondary/40 rounded-full flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3,5 L7,9 L11,5" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}

export default BirthdayReveal;
