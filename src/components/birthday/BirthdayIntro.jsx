// ─── BirthdayIntro ───
// Section 2: Birthday introduction with lily decorations and birthday wish.

import React from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import SectionHeading from '../common/SectionHeading';

const { intro } = birthdayContent;

// Lily SVG illustration
function LilyDecoration({ flip = false, size = 80 }) {
  return (
    <motion.div
      animate={{ rotate: flip ? [5, -5, 5] : [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transform: flip ? 'scaleX(-1)' : 'scaleX(1)' }}
    >
      <svg width={size} height={size * 1.3} viewBox="0 0 60 80" fill="none">
        {/* Stem */}
        <path d="M30,80 Q28,60 30,45" stroke="#A8B99A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <path d="M28,65 Q18,55 22,48" stroke="#A8B99A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M32,60 Q42,50 38,43" stroke="#A8B99A" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            key={i}
            cx="30"
            cy="30"
            rx="6"
            ry="16"
            fill="white"
            stroke="#E8E8E8"
            strokeWidth="1"
            transform={`rotate(${angle} 30 30) translate(0 -10)`}
            opacity={0.9}
          />
        ))}
        {/* Center */}
        <circle cx="30" cy="30" r="5" fill="#F5DF8B" />
        {/* Stamens */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <circle
            key={i}
            cx={30 + 7 * Math.cos((angle * Math.PI) / 180)}
            cy={30 + 7 * Math.sin((angle * Math.PI) / 180)}
            r="1.5"
            fill="#F5DF8B"
            opacity={0.8}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// Rotated card
function ScrapCard({ children, rotation = 0, bgColor = '#fff' }) {
  return (
    <motion.div
      className="rounded-2xl p-5 shadow-md relative"
      style={{
        background: bgColor,
        transform: `rotate(${rotation}deg)`,
        border: '1px solid rgba(52,56,47,0.08)',
      }}
      whileHover={{ scale: 1.02, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}

function BirthdayIntro() {
  return (
    <section
      id="intro"
      className="relative overflow-hidden py-16 px-5"
      style={{ background: '#F7F6EF' }}
    >
      <div className="max-w-sm mx-auto">
        {/* Lily decorations */}
        <div className="flex justify-between items-start mb-4 px-2">
          <LilyDecoration size={60} />
          <SectionHeading
            title={intro.heading}
            subtitle={intro.subheading}
            className="flex-1 mx-3"
          />
          <LilyDecoration flip size={60} />
        </div>

        {/* Birthday wish card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <ScrapCard rotation={-1} bgColor="#fff">
            {/* Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 rounded-sm opacity-70"
              style={{ background: '#F5DF8B', transform: 'translateX(-50%) rotate(-2deg)' }} />

            <p className="font-handwritten text-lg text-ink leading-relaxed whitespace-pre-line">
              {intro.wish}
            </p>

            {/* Annotation */}
            <p className="font-handwritten text-xs text-secondary/60 text-right mt-3 italic">
              {intro.annotation}
            </p>
          </ScrapCard>
        </motion.div>

        {/* Stickers row */}
        <motion.div
          className="flex gap-2 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { text: '🌸 FABULOUS', rotate: -3 },
            { text: '✨ QUEEN', rotate: 2 },
            { text: '🌿 CHAOTIC', rotate: -1 },
            { text: '💚 ICONIC', rotate: 3 },
          ].map(({ text, rotate }) => (
            <motion.span
              key={text}
              className="sticker"
              style={{ transform: `rotate(${rotate}deg)` }}
              whileHover={{ scale: 1.1, rotate: 0 }}
            >
              {text}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default BirthdayIntro;
