// ─── BirthdayExperience ───
// One continuous scrolling birthday experience across all 7 sections.

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollProgress from '../components/common/ScrollProgress';
import MusicPlayer from '../components/audio/MusicPlayer';
import BirthdayReveal from '../components/landing/BirthdayReveal';
import BirthdayIntro from '../components/birthday/BirthdayIntro';
import RoastCards from '../components/birthday/RoastCards';
import PhotoGallery from '../components/birthday/PhotoGallery';
import LilyGarden from '../components/birthday/LilyGarden';
import FinalSurprise from '../components/birthday/FinalSurprise';
import MagicHandExperience from '../components/camera/MagicHandExperience';
import GoldfishEasterEgg from '../components/birthday/GoldfishEasterEgg';

function BirthdayExperience({ isBlocked, onDismissBlocked }) {
  const introRef = useRef(null);

  const scrollToIntro = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Persistent UI */}
      <ScrollProgress />
      <MusicPlayer isBlocked={isBlocked} onDismissBlocked={onDismissBlocked} />

      {/* Section 1 — Birthday Reveal */}
      <BirthdayReveal onScrollNext={scrollToIntro} />

      {/* Section 2 — Birthday Introduction */}
      <div ref={introRef}>
        <BirthdayIntro />
      </div>

      {/* Section 3 — Roast Department */}
      <RoastCards />

      {/* Section 4 — Photo Gallery */}
      <PhotoGallery />

      {/* Section 5 — Lily Garden */}
      <LilyGarden />

      {/* Section 6 — Final Surprise */}
      <FinalSurprise />

      {/* Camera AR — before easter egg */}
      <MagicHandExperience />

      {/* Section 7 — Goldfish Easter Egg */}
      <GoldfishEasterEgg />
    </motion.div>
  );
}

export default BirthdayExperience;
