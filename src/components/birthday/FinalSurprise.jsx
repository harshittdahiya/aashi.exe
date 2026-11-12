// ─── FinalSurprise ───
// Section 6: Final message with hidden reveal.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import SectionHeading from '../common/SectionHeading';
import FloatingPetals from '../common/FloatingPetals';
import { createConfetti } from '../../utils/animationHelpers';

const { finalSurprise } = birthdayContent;

function ConfettiPiece({ x, y, delay, duration, color, size, rotate }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, borderRadius: '2px' }}
      initial={{ opacity: 1, rotate: 0, y: 0 }}
      animate={{ opacity: 0, rotate, y: -120 }}
      transition={{ delay, duration, ease: 'easeOut' }}
    />
  );
}

function FinalSurprise() {
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [petalBurst, setPetalBurst] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const handleReveal = () => {
    if (revealed) return;
    const newConfetti = createConfetti(32);
    setConfetti(newConfetti);
    setShowConfetti(true);
    setPetalBurst(true);
    setRevealed(true);

    setTimeout(() => {
      setShowConfetti(false);
      setConfetti([]);
      setPetalBurst(false);
    }, 3000);
  };

  return (
    <section
      id="final-surprise"
      className="relative py-20 px-5 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F7F6EF 0%, #EEF2E9 100%)' }}
    >
      <FloatingPetals trigger={petalBurst} count={20} />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confetti.map(c => (
          <ConfettiPiece key={c.id} {...c} />
        ))}
      </AnimatePresence>

      <div className="max-w-sm mx-auto relative z-10 text-center">
        <SectionHeading
          label="🎊 Final Act"
          title={finalSurprise.heading}
        />

        <motion.p
          className="font-body text-secondary text-base leading-relaxed mb-10 max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {finalSurprise.message}
        </motion.p>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.button
              key="reveal-btn"
              className="btn-primary text-xl py-5 px-8"
              onClick={handleReveal}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              {finalSurprise.buttonText}
            </motion.button>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              className="relative"
            >
              {/* Message card */}
              <div
                className="bg-white rounded-3xl p-8 shadow-xl border-2 mx-auto relative"
                style={{ borderColor: '#A8B99A', maxWidth: '320px' }}
              >
                {/* Tape */}
                <div
                  className="absolute -top-4 left-1/2 w-16 h-6 rounded-sm opacity-80"
                  style={{ background: '#F5DF8B', transform: 'translateX(-50%) rotate(-2deg)' }}
                />

                <div className="text-5xl mb-4">🌸</div>
                <p className="font-handwritten text-xl text-ink leading-relaxed mb-4">
                  {finalSurprise.hiddenMessage}
                </p>
                <p className="font-handwritten text-base text-secondary leading-relaxed">
                  {finalSurprise.hiddenSubtext}
                </p>

                {/* Stickers */}
                <div className="flex gap-2 justify-center mt-5 flex-wrap">
                  {['✨', '🌸', '💚', '🎉'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FinalSurprise;
