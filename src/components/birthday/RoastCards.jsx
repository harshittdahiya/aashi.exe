// ─── RoastCards ───
// Section 3: Double Battery + Goldfish case files with interactive animations.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import SectionHeading from '../common/SectionHeading';
import { FloatingDoodles } from '../common/FloatingDoodles';

const { roast } = birthdayContent;

// ── Battery icon SVG ──
function BatteryIcon({ charging }) {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
      <rect x="1" y="4" width="40" height="16" rx="4" stroke="#34382F" strokeWidth="2" />
      <rect x="41" y="9" width="5" height="6" rx="2" fill="#34382F" />
      {/* Fill bar */}
      <motion.rect
        x="4"
        y="7"
        height="10"
        rx="2"
        fill={charging ? '#22c55e' : '#F5DF8B'}
        initial={{ width: 5 }}
        animate={charging ? { width: [5, 32, 5], fill: ['#ef4444', '#f59e0b', '#22c55e'] } : { width: 24 }}
        transition={charging ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      />
      {/* Charging bolt */}
      {charging && (
        <motion.text
          x="20"
          y="16"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ⚡
        </motion.text>
      )}
    </svg>
  );
}

// ── Glasses SVG ──
function GlassesIcon() {
  return (
    <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
      {/* Bridge */}
      <path d="M28,18 Q40,14 52,18" stroke="#34382F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Temple arms */}
      <path d="M4,18 L12,18" stroke="#34382F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M68,18 L76,18" stroke="#34382F" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left lens */}
      <rect x="8" y="8" width="22" height="20" rx="8" stroke="#34382F" strokeWidth="2.5" fill="#A8B99A" fillOpacity="0.2" />
      {/* Right lens */}
      <rect x="50" y="8" width="22" height="20" rx="8" stroke="#34382F" strokeWidth="2.5" fill="#A8B99A" fillOpacity="0.2" />
      {/* Shine */}
      <line x1="13" y1="12" x2="18" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="55" y1="12" x2="60" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// ── Double Battery Card ──
function DoubleBatteryCard() {
  const [charging, setCharging] = useState(false);
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    setCharging(true);
    setTapped(true);
    setTimeout(() => setCharging(false), 4000);
  };

  return (
    <motion.div
      className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden cursor-pointer select-none"
      style={{ border: '2px solid #34382F', transform: 'rotate(-2deg)' }}
      whileTap={{ scale: 0.97 }}
      onClick={handleTap}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 150 }}
    >
      {/* Case file stamp */}
      <div className="absolute top-3 right-3 opacity-30">
        <div className="font-display text-xs border-2 border-ink rounded px-2 py-0.5 rotate-12">
          CLASSIFIED
        </div>
      </div>

      <div className="text-center">
        <p className="font-handwritten text-xs text-secondary tracking-widest uppercase mb-2">
          {roast.doubleBattery.caseNumber}
        </p>

        <h3 className="font-display text-2xl text-ink mb-4">
          {roast.doubleBattery.heading}
        </h3>

        {/* Glasses illustration */}
        <div className="flex justify-center mb-4">
          <motion.div
            animate={tapped ? { rotate: [-5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <GlassesIcon />
          </motion.div>
        </div>

        {/* Two batteries */}
        <div className="flex justify-center gap-4 mb-4">
          <BatteryIcon charging={charging} />
          <BatteryIcon charging={charging} />
        </div>

        <p className="font-body text-secondary text-sm mb-3 leading-relaxed">
          {roast.doubleBattery.description}
        </p>
        <p className="font-body text-secondary text-xs mb-4 leading-relaxed opacity-80">
          {roast.doubleBattery.details}
        </p>

        {/* Sticker */}
        <AnimatePresence>
          {tapped && (
            <motion.div
              className="sticker mx-auto inline-block mb-3"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -3 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring' }}
            >
              {roast.doubleBattery.sticker}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="font-handwritten text-sm text-sage-dark animate-bounce-soft">
          {roast.doubleBattery.tapHint}
        </p>
      </div>
    </motion.div>
  );
}

// ── Goldfish SVG ──
function GoldfishSVG({ swimming }) {
  return (
    <motion.div
      animate={swimming ? { x: [-30, 30, -30], scaleX: [1, 1, -1, -1, 1] } : {
        x: [0, 10, 0, -10, 0],
        scaleX: [1, 1, -1, -1, 1]
      }}
      transition={{
        duration: swimming ? 2 : 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
        {/* Body */}
        <ellipse cx="28" cy="22" rx="18" ry="12" fill="#f97316" />
        {/* Tail */}
        <path d="M46,22 L58,10 L58,34 Z" fill="#fb923c" />
        {/* Eye */}
        <circle cx="16" cy="18" r="4" fill="white" />
        <circle cx="15" cy="18" r="2" fill="#34382F" />
        {/* Fin top */}
        <path d="M22,10 Q30,4 36,10" stroke="#ea580c" strokeWidth="2" fill="#fb923c" fillOpacity="0.5" />
        {/* Scales */}
        <path d="M28,14 Q32,16 28,18" stroke="#ea580c" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M22,16 Q26,18 22,20" stroke="#ea580c" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Mouth */}
        <path d="M10,22 Q12,25 10,24" stroke="#34382F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Bubbles */}
        {swimming && [0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx={6 - i * 3}
            cy={15 - i * 5}
            r={2 - i * 0.3}
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: [-5 * i, -15 - 5 * i] }}
            transition={{ delay: i * 0.3, duration: 1.5, repeat: Infinity }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// ── Memory meter ──
function MemoryMeter({ value }) {
  return (
    <div className="w-full">
      <div className="flex justify-between font-handwritten text-xs text-secondary mb-1">
        <span>Memory</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 bg-off-white rounded-full border border-ink/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: value > 50 ? '#22c55e' : value > 20 ? '#f59e0b' : '#ef4444' }}
          initial={{ width: '100%' }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ── Goldfish Card ──
function GoldfishCard() {
  const [swimming, setSwimming] = useState(false);
  const [memory, setMemory] = useState(100);
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    setSwimming(true);
    setTapped(true);
    setMemory(3);
    setTimeout(() => {
      setSwimming(false);
      setTimeout(() => setMemory(100), 3000);
    }, 4000);
  };

  return (
    <motion.div
      className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden cursor-pointer select-none"
      style={{ border: '2px solid #34382F', transform: 'rotate(1.5deg)' }}
      whileTap={{ scale: 0.97 }}
      onClick={handleTap}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 150, delay: 0.1 }}
    >
      {/* Case file stamp */}
      <div className="absolute top-3 right-3 opacity-30">
        <div className="font-display text-xs border-2 border-ink rounded px-2 py-0.5 -rotate-12">
          TOP SECRET
        </div>
      </div>

      <div className="text-center">
        <p className="font-handwritten text-xs text-secondary tracking-widest uppercase mb-2">
          {roast.goldfish.caseNumber}
        </p>

        <h3 className="font-display text-2xl text-ink mb-4">
          {roast.goldfish.heading}
        </h3>

        {/* Fishbowl */}
        <div className="relative mx-auto w-28 h-28 mb-4">
          {/* Bowl */}
          <svg className="absolute inset-0" width="112" height="112" viewBox="0 0 112 112" fill="none">
            <ellipse cx="56" cy="62" rx="44" ry="38" fill="#bfdbfe" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="2" />
            <ellipse cx="56" cy="30" rx="22" ry="8" fill="white" fillOpacity="0.6" stroke="#93c5fd" strokeWidth="1.5" />
            {/* Water shine */}
            <path d="M24,55 Q40,48 56,52 Q72,56 88,50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none" />
            {/* Bubbles */}
            {[0, 1].map(i => (
              <motion.circle
                key={i}
                cx={45 + i * 20}
                cy={45}
                r="4"
                fill="none"
                stroke="white"
                strokeWidth="1"
                animate={{ y: [0, -20], opacity: [0.7, 0] }}
                transition={{ delay: i * 0.7, duration: 1.5, repeat: Infinity }}
              />
            ))}
            {/* Gravel */}
            {[20, 36, 52, 68, 84].map((x, i) => (
              <ellipse key={i} cx={x} cy="96" rx="6" ry="4" fill="#A8B99A" fillOpacity="0.5" />
            ))}
          </svg>

          {/* Fish inside */}
          <div className="absolute inset-0 flex items-center justify-center">
            <GoldfishSVG swimming={swimming} />
          </div>
        </div>

        {/* Memory meter */}
        <div className="mb-4">
          <MemoryMeter value={memory} />
        </div>

        <p className="font-body text-secondary text-sm mb-2 leading-relaxed">
          {roast.goldfish.description}
        </p>
        <p className="font-handwritten text-base text-ink mb-3 italic">
          "{roast.goldfish.followup}"
        </p>
        <p className="font-body text-secondary text-xs mb-4 leading-relaxed opacity-80">
          {roast.goldfish.details}
        </p>

        <p className="font-handwritten text-sm text-sage-dark animate-bounce-soft">
          {roast.goldfish.tapHint}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main RoastCards component ──
function RoastCards() {
  return (
    <section
      id="roast"
      className="relative py-16 px-5 overflow-hidden"
      style={{ background: '#EEF2E9' }}
    >
      <FloatingDoodles section="roast" />

      <div className="max-w-sm mx-auto relative z-10">
        <SectionHeading
          label="🔍 Investigation"
          title={roast.heading}
        />

        <div className="space-y-6">
          <DoubleBatteryCard />
          <GoldfishCard />
        </div>
      </div>
    </section>
  );
}

export default RoastCards;
