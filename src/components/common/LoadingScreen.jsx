// ─── LoadingScreen ───

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingMessages = [
  "Brewing chaos...",
  "Dusting off the memories...",
  "Inflating virtual balloons...",
  "Teaching goldfish new tricks...",
  "Charging the double batteries...",
];

function LoadingScreen({ onComplete }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % loadingMessages.length);
    }, 600);

    const timer = setTimeout(() => {
      clearInterval(interval);
      onComplete?.();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-[200]"
      style={{ background: '#F7F6EF' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Lily spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-6"
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          {/* 6 petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse
              key={i}
              cx="32"
              cy="32"
              rx="6"
              ry="16"
              fill={i % 2 === 0 ? '#fff' : '#A8B99A'}
              transform={`rotate(${angle} 32 32) translate(0 -12)`}
              opacity={0.7 + i * 0.05}
            />
          ))}
          <circle cx="32" cy="32" r="6" fill="#F5DF8B" />
        </svg>
      </motion.div>

      <p className="font-handwritten text-xl text-secondary">
        {loadingMessages[msgIndex]}
      </p>
    </motion.div>
  );
}

export default LoadingScreen;
