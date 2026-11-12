// ─── PhotoModal ───
// Full-screen photo lightbox with tap-to-close.

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PhotoModal({ photo, onClose }) {
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [photo]);

  // Close on background tap
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(52, 56, 47, 0.92)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative max-w-sm w-full"
            initial={{ scale: 0.8, y: 30, rotate: photo.rotation || 0 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Polaroid frame */}
            <div className="bg-white p-4 pb-14 shadow-2xl relative">
              {/* Tape */}
              <div
                className="absolute -top-4 left-1/2 w-14 h-6 rounded-sm opacity-80"
                style={{ background: '#F5DF8B', transform: 'translateX(-50%) rotate(-2deg)' }}
              />

              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full object-cover"
                style={{ maxHeight: '65vh', objectPosition: 'center top' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Caption */}
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <p className="font-handwritten text-base text-secondary">{photo.caption}</p>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              className="absolute -top-4 -right-4 w-10 h-10 bg-ink text-off-white rounded-full flex items-center justify-center font-display text-xl shadow-lg"
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              aria-label="Close photo"
            >
              ×
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PhotoModal;
