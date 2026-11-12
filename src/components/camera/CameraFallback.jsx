// ─── CameraFallback ───
// Shown when camera or hand tracking is unavailable.
// Provides a manual tap-to-show-cat interaction.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';

const { camera } = birthdayContent;

const CAT_SRC = '/images/stickers/birthday-cat.jpg';

function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-2 h-2"
          style={{
            transformOrigin: '0 0',
            transform: `rotate(${angle}deg) translate(60px, 0)`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            delay: i * 0.08,
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <polygon points="4,0 5,3 8,4 5,5 4,8 3,5 0,4 3,3" fill="#F5DF8B" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CameraFallback({ errorMessage }) {
  const [catVisible, setCatVisible] = useState(false);
  const [catError, setCatError] = useState(false);

  const toggleCat = () => setCatVisible(v => !v);

  return (
    <div className="flex flex-col items-center text-center px-5">
      {/* Error message */}
      <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(168,185,154,0.2)', border: '1px solid #A8B99A' }}>
        <p className="font-handwritten text-base text-secondary">
          {errorMessage || camera.cameraUnavailable}
        </p>
      </div>

      {/* Fallback instruction */}
      <p className="font-handwritten text-lg text-ink mb-6">
        {camera.fallbackText}
      </p>

      {/* Cat summon area */}
      <div className="relative w-64 h-64 mb-6 flex items-center justify-center rounded-3xl cursor-pointer"
        style={{ background: '#EEF2E9', border: '2px dashed #A8B99A' }}
        onClick={toggleCat}
      >
        <AnimatePresence>
          {catVisible ? (
            <motion.div
              key="cat"
              initial={{ scale: 0, rotate: -20, y: 30 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0, rotate: 20, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              <SparkleEffect />

              {catError ? (
                // If cat image is missing, show placeholder cat
                <div className="flex flex-col items-center">
                  <span className="text-7xl">🐱</span>
                  <span className="text-3xl -mt-4">🎂</span>
                  <div
                    className="mt-2 text-xs font-handwritten text-secondary bg-white/70 rounded-lg px-3 py-1"
                  >
                    Add: birthday-cat.jpg
                  </div>
                </div>
              ) : (
                <img
                  src={CAT_SRC}
                  alt="Birthday cat with hat"
                  className="w-32 h-32 object-contain"
                  onError={() => setCatError(true)}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-4xl mb-2">✨</div>
              <p className="font-handwritten text-secondary text-sm">Tap to summon!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <motion.button
        className={catVisible ? 'btn-secondary text-base py-3 px-6' : 'btn-primary text-base py-3 px-6'}
        onClick={toggleCat}
        whileTap={{ scale: 0.95 }}
      >
        {catVisible ? '✕ Hide the cat' : '🐱 Summon the cat!'}
      </motion.button>
    </div>
  );
}

export default CameraFallback;
