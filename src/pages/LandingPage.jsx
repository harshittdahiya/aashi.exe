// ─── LandingPage ───
// The gated landing page — only the birthday person can get through.

import React from 'react';
import { motion } from 'framer-motion';
import DateVerification from '../components/landing/DateVerification';

function LandingPage({ onSuccess, attemptPlay }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <DateVerification onSuccess={onSuccess} attemptPlay={attemptPlay} />
    </motion.div>
  );
}

export default LandingPage;
