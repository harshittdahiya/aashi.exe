// ─── MagicHandExperience ───
// Section that houses the camera AR feature with graceful fallback.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import SectionHeading from '../common/SectionHeading';
import HandTracking from './HandTracking';
import CameraFallback from './CameraFallback';

const { camera } = birthdayContent;

// Check if MediaPipe and camera are likely available
const isCameraSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

function MagicHandExperience() {
  const [phase, setPhase] = useState('idle'); // idle | tracking | fallback
  const [fallbackReason, setFallbackReason] = useState('');

  const handleActivate = async () => {
    if (!isCameraSupported()) {
      setFallbackReason(camera.cameraUnavailable);
      setPhase('fallback');
      return;
    }
    setPhase('tracking');
  };

  const handleStop = () => {
    setPhase('idle');
  };

  const handleFallback = (reason) => {
    setFallbackReason(reason);
    setPhase('fallback');
  };

  return (
    <section
      id="magic-hand"
      className="relative py-16 px-5 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #EEF2E9 0%, #F7F6EF 100%)' }}
    >
      <div className="max-w-sm mx-auto relative z-10">
        <SectionHeading
          label="✨ Magic Time"
          title={camera.sectionHeading}
          subtitle={camera.description}
        />

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Illustration */}
              <div className="relative mx-auto w-48 h-48 mb-8 flex items-center justify-center">
                <div className="w-full h-full rounded-3xl flex items-center justify-center"
                  style={{ background: '#EEF2E9', border: '2px dashed #A8B99A' }}>
                  <div className="text-center">
                    <span className="text-5xl block mb-2">🐱</span>
                    <span className="text-5xl block">✋</span>
                  </div>
                </div>

                {/* Floating sparkles */}
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ top: `${10 + i * 25}%`, right: `${5 + i * 5}%` }}
                    animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }}
                    transition={{ delay: i * 0.4, duration: 2, repeat: Infinity }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <polygon points="7,0 8.5,5 14,7 8.5,8.5 7,14 5.5,8.5 0,7 5.5,5" fill="#F5DF8B" />
                    </svg>
                  </motion.div>
                ))}
              </div>

              {/* Privacy note */}
              <p className="font-handwritten text-sm text-secondary/70 mb-6 max-w-xs mx-auto">
                🔒 Camera stays local. Nothing is uploaded. Promise.
              </p>

              <motion.button
                className="btn-primary text-xl py-5 px-8 mx-auto"
                onClick={handleActivate}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
              >
                {camera.buttonText}
              </motion.button>

              <motion.button
                className="block mt-4 mx-auto font-handwritten text-sm text-secondary underline underline-offset-2"
                onClick={() => setPhase('fallback')}
              >
                Camera not working? Use manual mode
              </motion.button>
            </motion.div>
          )}

          {phase === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <React.Suspense fallback={
                <div className="text-center py-10">
                  <p className="font-handwritten text-secondary">Loading camera...</p>
                </div>
              }>
                <HandTracking onStop={handleStop} onFallback={handleFallback} />
              </React.Suspense>
            </motion.div>
          )}

          {phase === 'fallback' && (
            <motion.div
              key="fallback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CameraFallback errorMessage={fallbackReason} />
              <div className="text-center mt-6">
                <button
                  className="font-handwritten text-sm text-secondary underline underline-offset-2"
                  onClick={() => setPhase('idle')}
                >
                  ← Try camera again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default MagicHandExperience;
