// ─── DateVerification ───
// Birthday date input gate with validation, shake animation, and petal burst.

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateBirthday, parseDay, parseMonth } from '../../utils/dateValidation';
import { birthdayContent } from '../../data/birthdayContent';
import FloatingPetals from '../common/FloatingPetals';
import { FloatingDoodles } from '../common/FloatingDoodles';

const { landing } = birthdayContent;

function DateVerification({ onSuccess, attemptPlay }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [petalBurst, setPetalBurst] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const handleDayChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setDay(val);
    setError('');
    // Auto-advance to month field
    if (val.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (e) => {
    const val = e.target.value.slice(0, 10);
    setMonth(val);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUnlocking) return;

    const parsedDay = parseDay(day);
    const parsedMonth = parseMonth(month);

    if (!parsedDay || !parsedMonth) {
      triggerError("That doesn't look like a date, genius. 🤨");
      return;
    }

    if (!validateBirthday(parsedDay, parsedMonth)) {
      triggerError(landing.errorMessage);
      return;
    }

    // ─── SUCCESS ───
    // 1. Attempt audio FIRST (inside user gesture)
    if (attemptPlay) {
      await attemptPlay();
    }

    // 2. Trigger petal burst
    setPetalBurst(true);
    setIsUnlocking(true);

    // 3. Transition after animation
    setTimeout(() => {
      onSuccess?.();
    }, 1400);
  };

  const triggerError = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-5 py-10"
      style={{ background: '#F7F6EF' }}>

      <FloatingPetals trigger={petalBurst} count={28} />
      <FloatingDoodles section="landing" />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="font-handwritten text-sm tracking-widest text-secondary uppercase border border-secondary/30 px-3 py-1 rounded-full">
          {landing.topLabel}
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        className="font-display text-5xl sm:text-6xl text-ink text-center mb-2 leading-none"
        initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        {landing.mainHeading}
      </motion.h1>

      {/* Secondary heading */}
      <motion.h2
        className="font-handwritten text-3xl text-sage-dark text-center mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {landing.secondaryHeading}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="font-body text-secondary text-center text-base max-w-xs mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {landing.description}
      </motion.p>

      {/* Form card */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-lg border-2 border-ink/8 relative"
          animate={isShaking ? {
            x: [-10, 10, -8, 8, -4, 4, 0],
            transition: { duration: 0.5 }
          } : {}}
        >
          {/* Tape decorations */}
          <div className="absolute -top-3 left-6 w-12 h-6 rounded-sm opacity-70"
            style={{ background: '#F5DF8B', transform: 'rotate(-3deg)' }} />
          <div className="absolute -top-3 right-6 w-12 h-6 rounded-sm opacity-70"
            style={{ background: '#A8B99A', transform: 'rotate(2deg)' }} />

          <h3 className="font-display text-xl text-ink text-center mb-5">
            {landing.formHeading}
          </h3>

          {/* Inputs */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1">
              <label className="font-handwritten text-sm text-secondary block mb-1 ml-1">Day</label>
              <input
                ref={dayRef}
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="DD"
                value={day}
                onChange={handleDayChange}
                className="w-full text-center font-display text-3xl text-ink bg-off-white border-2 border-ink/15 rounded-2xl py-4 focus:outline-none focus:border-sage transition-colors"
                aria-label="Birthday day"
              />
            </div>

            <div className="flex items-end pb-4">
              <span className="font-display text-3xl text-secondary">/</span>
            </div>

            <div className="flex-1">
              <label className="font-handwritten text-sm text-secondary block mb-1 ml-1">Month</label>
              <input
                ref={monthRef}
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="MM"
                value={month}
                onChange={handleMonthChange}
                className="w-full text-center font-display text-3xl text-ink bg-off-white border-2 border-ink/15 rounded-2xl py-4 focus:outline-none focus:border-sage transition-colors"
                aria-label="Birthday month (number or name)"
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="font-handwritten text-base text-red-500 text-center mb-3"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isUnlocking}
            className="w-full btn-primary text-lg py-4 rounded-2xl"
            whileTap={{ scale: 0.96 }}
            animate={isUnlocking ? { scale: [1, 1.05, 1], opacity: 0.8 } : {}}
          >
            {isUnlocking ? '✨ Unlocking...' : landing.buttonText}
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Hint */}
      <motion.p
        className="font-handwritten text-sm text-secondary/70 text-center mt-5 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {landing.hint}
      </motion.p>

      {/* Footer */}
      <motion.p
        className="font-handwritten text-xs text-secondary/50 text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {landing.footer}
      </motion.p>

      {/* Decorative lily */}
      <motion.div
        className="absolute bottom-6 right-4 opacity-20"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <line x1="30" y1="80" x2="30" y2="40" stroke="#A8B99A" strokeWidth="2" />
          <ellipse cx="30" cy="30" rx="8" ry="20" fill="white" stroke="#A8B99A" strokeWidth="1.5" />
          <ellipse cx="30" cy="30" rx="8" ry="20" fill="white" stroke="#A8B99A" strokeWidth="1.5" transform="rotate(60 30 30)" />
          <ellipse cx="30" cy="30" rx="8" ry="20" fill="white" stroke="#A8B99A" strokeWidth="1.5" transform="rotate(120 30 30)" />
          <circle cx="30" cy="30" r="4" fill="#F5DF8B" />
        </svg>
      </motion.div>
    </div>
  );
}

export default DateVerification;
