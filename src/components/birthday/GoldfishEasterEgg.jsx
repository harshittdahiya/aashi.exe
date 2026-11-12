// ─── GoldfishEasterEgg ───
// Section 7: Hidden goldfish easter egg at the very bottom.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';

const { easterEgg } = birthdayContent;

function GoldfishBowl() {
  return (
    <div className="relative mx-auto w-40 h-40">
      {/* Bowl outline */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160" fill="none">
        {/* Water */}
        <ellipse cx="80" cy="90" rx="60" ry="52" fill="#bfdbfe" fillOpacity="0.5" />
        {/* Bowl outline */}
        <ellipse cx="80" cy="90" rx="60" ry="52" stroke="#93c5fd" strokeWidth="2.5" />
        {/* Neck */}
        <ellipse cx="80" cy="42" rx="30" ry="10" fill="#e0f2fe" fillOpacity="0.7" stroke="#93c5fd" strokeWidth="2" />
        {/* Rim */}
        <ellipse cx="80" cy="38" rx="30" ry="6" fill="white" fillOpacity="0.8" stroke="#93c5fd" strokeWidth="1.5" />
        {/* Water surface shimmer */}
        <path d="M28,78 Q55,70 80,76 Q105,82 132,74" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
        {/* Bubbles */}
        {[55, 90, 115].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={80 - i * 12}
            r={3 - i * 0.5}
            fill="none"
            stroke="white"
            strokeWidth="1"
            animate={{
              y: [0, -15],
              opacity: [0.7, 0],
            }}
            transition={{
              delay: i * 0.6,
              duration: 1.8,
              repeat: Infinity,
            }}
          />
        ))}
        {/* Gravel */}
        {[26, 44, 62, 80, 98, 116, 134].map((x, i) => (
          <ellipse key={i} cx={x} cy="136" rx="8" ry="5" fill="#A8B99A" fillOpacity="0.5" />
        ))}
      </svg>

      {/* Fish */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            x: [-25, 25, -25],
            scaleX: [1, 1, -1, -1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
            {/* Body */}
            <ellipse cx="22" cy="18" rx="16" ry="10" fill="#f97316" />
            {/* Tail */}
            <path d="M38,18 L50,8 L50,28 Z" fill="#fb923c" />
            {/* Eye */}
            <circle cx="12" cy="14" r="4" fill="white" />
            <circle cx="11" cy="14" r="2" fill="#34382F" />
            {/* Fin */}
            <path d="M18,8 Q24,3 30,8" stroke="#ea580c" strokeWidth="1.5" fill="#fb923c" fillOpacity="0.5" />
            {/* Mouth */}
            <path d="M6,18 Q8,21 6,20" stroke="#34382F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function GoldfishEasterEgg() {
  const [phase, setPhase] = useState('initial'); // initial | question | responded
  const [response, setResponse] = useState('');

  const handleResponse = (choice) => {
    setResponse(choice === 'yes' ? easterEgg.responseYes : easterEgg.responseNo);
    setPhase('responded');
  };

  return (
    <section
      id="easter-egg"
      className="relative py-16 px-5 overflow-hidden"
      style={{ background: '#34382F' }}
    >
      <div className="max-w-sm mx-auto text-center">
        {/* Fishbowl */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="mb-6"
        >
          <GoldfishBowl />
        </motion.div>

        {/* Initial message */}
        <motion.p
          className="font-display text-2xl text-off-white mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {easterEgg.initial}
        </motion.p>

        {/* Delayed question */}
        <AnimatePresence>
          {phase !== 'initial' ? null : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              onAnimationComplete={() => setPhase('question')}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {phase === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-handwritten text-xl text-sage mb-6">
                {easterEgg.delayed}
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  className="btn-secondary text-base py-3 px-6"
                  onClick={() => handleResponse('yes')}
                  whileTap={{ scale: 0.95 }}
                >
                  {easterEgg.buttons.yes}
                </motion.button>
                <motion.button
                  className="btn-primary text-base py-3 px-6"
                  onClick={() => handleResponse('no')}
                  whileTap={{ scale: 0.95 }}
                >
                  {easterEgg.buttons.no}
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === 'responded' && (
            <motion.p
              key="response"
              className="font-display text-xl text-butter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {response}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="mt-10 pt-8 border-t border-off-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-handwritten text-secondary/40 text-xs mt-1">
            The Birthday Department™ — Est. November 14
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default GoldfishEasterEgg;
