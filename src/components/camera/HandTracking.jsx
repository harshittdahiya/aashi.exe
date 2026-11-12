// ─── HandTracking ───
// Renders the camera view with hand tracking overlay.
// Displays birthday cat above the detected palm.

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHandTracking, HandTrackingState } from '../../hooks/useHandTracking';
import { birthdayContent } from '../../data/birthdayContent';
import { clamp } from '../../utils/animationHelpers';
import { getHandGuidanceText } from '../../utils/handTracking';

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
  const previewRef = useRef(null);
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

  const isLoading = state === HandTrackingState.LOADING || state === HandTrackingState.READY;

  const guidanceText = getHandGuidanceText(
    state === HandTrackingState.TRACKING,
    handData,
    camera
  );

  let catPosition = null;
  let catSize = 100;
  if (handData?.isOpen && previewRef.current && videoRef.current?.videoWidth) {
    const preview = previewRef.current;
    const video = videoRef.current;
    const width = preview.clientWidth;
    const height = preview.clientHeight;
    const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
    const renderedWidth = video.videoWidth * scale;
    const renderedHeight = video.videoHeight * scale;
    const offsetX = (width - renderedWidth) / 2;
    const offsetY = (height - renderedHeight) / 2;
    const palmX = (1 - handData.palmCenter.x) * renderedWidth + offsetX;
    const palmY = handData.palmCenter.y * renderedHeight + offsetY;
    const maxCatSize = Math.min(160, width * 0.45, height * 0.45);
    catSize = clamp(
      handData.palmSize * renderedHeight * 1.1,
      Math.min(80, maxCatSize),
      maxCatSize
    );
    const lift = clamp(height * 0.15, 60, 90);

    catPosition = {
      left: clamp(palmX - catSize / 2, 0, width - catSize),
      top: clamp(palmY - lift - catSize / 2, 0, height - catSize),
    };
  }

  return (
    <div className="relative w-full">
      {/* Video container */}
      <div
        ref={previewRef}
        className="relative overflow-hidden rounded-3xl"
        style={{ aspectRatio: '3/4', maxHeight: '65vh' }}
      >
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

        {/* Birthday cat overlay */}
        <AnimatePresence>
          {handData?.isOpen && catPosition && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: catPosition.left,
                top: catPosition.top,
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

      {/* Dynamic guidance stays visible while the camera initializes and tracks. */}
      <div className="flex justify-center mt-3" role="status" aria-live="polite" aria-atomic="true">
        <div className="max-w-full bg-ink/80 text-off-white rounded-2xl px-4 py-2 text-center">
          <p className="font-handwritten text-lg">{guidanceText}</p>
        </div>
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
