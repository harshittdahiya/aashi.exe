// ─── MusicPlayer ───
// Compact floating music player — persistent across all sections.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { birthdayContent } from '../../data/birthdayContent';

const { music } = birthdayContent;

// Animated equalizer bars
function Equalizer({ playing }) {
  if (!playing) {
    return (
      <div className="flex items-end gap-0.5 h-5">
        {[8, 12, 10, 14].map((h, i) => (
          <div key={i} className="w-1 rounded-full" style={{ height: `${h}px`, background: '#A8B99A' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-0.5 h-5">
      <div className="w-1 bg-sage rounded-full eq-bar-1" style={{ height: '8px' }} />
      <div className="w-1 bg-sage rounded-full eq-bar-2" style={{ height: '16px' }} />
      <div className="w-1 bg-sage rounded-full eq-bar-3" style={{ height: '12px' }} />
      <div className="w-1 bg-sage rounded-full eq-bar-4" style={{ height: '20px' }} />
    </div>
  );
}

function MusicPlayer({ isBlocked, onDismissBlocked }) {
  const { isPlaying, isMuted, progress, isAvailable, isLoaded, togglePlay, toggleMute, seekTo } = useAudio();
  const [expanded, setExpanded] = useState(false);

  if (!isAvailable) {
    return null; // Gracefully hidden when file is missing
  }

  return (
    <>
      {/* Autoplay blocked notification */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div
            className="fixed bottom-20 left-1/2 z-[150] max-w-xs w-full"
            style={{ transform: 'translateX(-50%)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button
              className="w-full bg-ink text-off-white rounded-2xl px-4 py-3 font-handwritten text-base shadow-xl"
              onClick={async () => {
                await togglePlay();
                onDismissBlocked?.();
              }}
            >
              {music.autoplayBlockedText}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating player */}
      <motion.div
        className="fixed bottom-5 right-4 z-[150]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              className="bg-ink rounded-3xl px-4 py-3 shadow-2xl min-w-[220px]"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Track info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Equalizer playing={isPlaying} />
                  <span className="font-handwritten text-sm text-off-white">{music.trackTitle}</span>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-off-white/50 font-display text-lg ml-2"
                  aria-label="Collapse player"
                >
                  ×
                </button>
              </div>

              {/* Progress bar */}
              <div
                className="w-full h-1.5 rounded-full mb-3 cursor-pointer"
                style={{ background: 'rgba(247,246,239,0.15)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = ((e.clientX - rect.left) / rect.width) * 100;
                  seekTo(pct);
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: '#A8B99A' }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Play/pause */}
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 bg-sage rounded-full flex items-center justify-center"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="#34382F">
                      <rect x="2" y="1" width="4" height="12" rx="1" />
                      <rect x="8" y="1" width="4" height="12" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="#34382F">
                      <path d="M2,1 L12,7 L2,13 Z" />
                    </svg>
                  )}
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="text-off-white/60 hover:text-off-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M2,6 L6,6 L10,2 L10,16 L6,12 L2,12 Z" />
                      <line x1="13" y1="6" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="17" y1="6" x2="13" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M2,6 L6,6 L10,2 L10,16 L6,12 L2,12 Z" />
                      <path d="M12,6 Q15,9 12,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M14,4 Q18,9 14,14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              className="w-12 h-12 bg-ink rounded-full flex items-center justify-center shadow-xl relative"
              onClick={() => setExpanded(true)}
              whileTap={{ scale: 0.9 }}
              aria-label="Open music player"
            >
              {/* Pulse ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-sage"
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <Equalizer playing={isPlaying} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default MusicPlayer;
