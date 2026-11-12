// ─── SectionHeading ───
// Reusable section heading with scrapbook styling.

import React from 'react';
import { motion } from 'framer-motion';

function SectionHeading({ label, title, subtitle, className = '' }) {
  return (
    <motion.div
      className={`text-center mb-8 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {label && (
        <div className="inline-block mb-3">
          <span
            className="font-handwritten text-sm font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-ink/20"
            style={{ background: '#F5DF8B', color: '#34382F' }}
          >
            {label}
          </span>
        </div>
      )}
      <h2
        className="font-display text-2xl sm:text-3xl leading-tight text-ink"
        style={{ lineHeight: 1.1 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="font-handwritten text-lg text-secondary mt-2">{subtitle}</p>
      )}
      {/* Decorative underline */}
      <div className="flex justify-center mt-3">
        <svg width="80" height="10" viewBox="0 0 80 10" fill="none">
          <path d="M2,6 Q20,2 40,6 Q60,10 78,6" stroke="#A8B99A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </motion.div>
  );
}

export default SectionHeading;
