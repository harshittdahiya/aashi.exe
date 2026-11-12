// ─── HandTracking ───
// Renders the camera view with hand tracking overlay.
// Displays birthday cat above the detected palm.

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHandTracking, HandTrackingState } from '../../hooks/useHandTracking';
import { birthdayContent } from '../../data/birthdayContent';
import { clamp } from '../../utils/animationHelpers';

const { camera } = birthdayContent;
const CAT_SRC = '/images/stickers/birthday-cat.jpg';

function SparkleLayer({ visible, x, y }) {
  if (!visible) return null;
  return (
    <>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-40px)`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ delay: i * 0.08, duration: 0.8, repeat: Infinity }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#F5DF8B" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

function HandTracking({ onStop, onFallback }) {
  const { state, handData, errorMessage, initialize, stop } = useHandTracking();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [catError, setCatError] = useState(false);

  // Surface camera/model failures to the parent so it can show manual mode.
  useEffect(() => {
    if ([
      HandTrackingState.PERMISSION_DENIED,
      HandTrackingState.CAMERA_ERROR,
      HandTrackingState.MODEL_ERROR,
      HandTrackingState.UNSUPPORTED,
    ].includes(state)) {
      onFallback?.(errorMessage || 'Camera tracking is unavailable. Use manual mode instead.');
    }
  }, [state, errorMessage, onFallback]);

  // Initialize tracking when component mounts
  useEffect(() => {
    if (videoRef.current) {
      initialize(videoRef.current);
    }
    return () => stop();
  }, [initialize, stop]);

  const handleStop = () => {
    stop();
    onStop?.();
  };

  // Map normalized landmark coords to mirrored display
  const mapToDisplay = (landmark) => {
    // Video is mirrored with scaleX(-1), so we invert X
    return {
      x: 1 - landmark.x,
      y: landmark.y,
    };
  };

  const isTracking = state === HandTrackingState.TRACKING;
  const isLoading = state === HandTrackingState.LOADING || state === HandTrackingState.READY;

  // Cat position & size from hand data
  const catPos = handData
    ? mapToDisplay(handData.palmCenter)
    : { x: 0.5, y: 0.3 };

  // Scale cat based on palm size (palmSize is normalized 0-1)
  const catSize = handData
    ? clamp(handData.palmSize * 600, 80, 200)
    : 100;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Video container */}
      <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: '3/4', maxHeight: '65vh' }}>
        {/* Video element — mirrored for front camera */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }} // Mirror
          playsInline
          muted
          autoPlay
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(52,56,47,0.3) 100%)' }}
        />

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: 'rgba(52,56,47,0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="mb-4"
              >
                <svg width="40" height="40" viewBox="0 0 40 40">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <circle
                      key={i}
                      cx={20 + 15 * Math.cos((angle * Math.PI) / 180)}
                      cy={20 + 15 * Math.sin((angle * Math.PI) / 180)}
                      r="4"
                      fill="#A8B99A"
                      opacity={0.3 + (i / 6) * 0.7}
                    />
                  ))}
                </svg>
              </motion.div>
              <p className="font-handwritten text-off-white text-lg">
                {state === HandTrackingState.LOADING ? 'Loading magic...' : 'Starting camera...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instruction overlay */}
        <AnimatePresence>
          {isTracking && !handData && (
            <motion.div
              className="absolute top-4 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-ink/80 text-off-white rounded-2xl px-4 py-2">
                <p className="font-handwritten text-base">{camera.instruction}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Palm detected badge */}
        <AnimatePresence>
          {handData?.isOpen && (
            <motion.div
              className="absolute top-4 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-sage/90 text-ink rounded-2xl px-4 py-2">
                <p className="font-handwritten text-base">✨ {camera.palmDetectedText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Birthday cat overlay */}
        <AnimatePresence>
          {handData?.isOpen && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: `${catPos.x * 100}%`,
                top: `${catPos.y * 100}%`,
                transform: 'translate(-50%, -100%)',
                width: catSize,
                height: catSize,
              }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Sparkles */}
              <SparkleLayer visible={true} x={0.5} y={0.5} />

              {catError ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span style={{ fontSize: catSize * 0.6 }}>🐱</span>
                  <span style={{ fontSize: catSize * 0.3, marginTop: -catSize * 0.1 }}>🎂</span>
                </div>
              ) : (
                <img
                  src={CAT_SRC}
                  alt="Birthday cat"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={() => setCatError(true)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-4">
        <motion.button
          className="btn-secondary text-base py-3 px-6"
          onClick={handleStop}
          whileTap={{ scale: 0.95 }}
        >
          ✕ Stop camera
        </motion.button>
      </div>
    </div>
  );
}

export default HandTracking;
