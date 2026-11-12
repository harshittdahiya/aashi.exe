// ─── PhotoGallery ───
// Section 4: Polaroid photo gallery with present, childhood, and thela sections.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../../data/birthdayContent';
import { photoManifest } from '../../data/photoManifest';
import SectionHeading from '../common/SectionHeading';
import PhotoModal from './PhotoModal';
import { FloatingDoodles } from '../common/FloatingDoodles';

const { gallery } = birthdayContent;

function GalleryFairyLights() {
  const topBulbs = Array.from({ length: 13 }, (_, index) => {
    const position = 6 + (index * 88) / 12;
    const curve = 20 * (1 - 4 * ((position - 50) / 100) ** 2);

    return {
      key: `top-${index}`,
      style: { left: `${position}%`, top: `${-24 + curve}px` },
      delay: (index * 0.71) % 3.2,
      duration: 3.1 + ((index * 7) % 17) / 10,
    };
  });
  const sideBulbs = Array.from({ length: 10 }, (_, index) => ({
    key: `side-${index}`,
    top: `${8 + index * 9.2}%`,
    delay: (index * 1.13) % 3.4,
    duration: 3.3 + ((index * 11) % 15) / 10,
  }));

  return (
    <div className="gallery-lights" aria-hidden="true">
      <div className="gallery-light-glow" />
      <div className="gallery-light-wire gallery-light-wire-top" />
      <div className="gallery-light-wire gallery-light-wire-left" />
      <div className="gallery-light-wire gallery-light-wire-right" />
      {topBulbs.map(({ key, style, delay, duration }) => (
        <span
          key={key}
          className="gallery-light-bulb"
          style={{ ...style, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
        />
      ))}
      {sideBulbs.flatMap(({ key, top, delay, duration }) => [
        <span
          key={`${key}-left`}
          className="gallery-light-bulb gallery-light-bulb-side gallery-light-bulb-left"
          style={{ top, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
        />,
        <span
          key={`${key}-right`}
          className="gallery-light-bulb gallery-light-bulb-side gallery-light-bulb-right"
          style={{ top, animationDelay: `${delay + 1.2}s`, animationDuration: `${duration + 0.4}s` }}
        />,
      ])}
    </div>
  );
}

// ── Placeholder card when image is missing ──
function PlaceholderCard({ photo, rotation }) {
  return (
    <div
      className="bg-white p-3 pb-10 shadow-md relative select-none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className="w-full aspect-[3/4] flex flex-col items-center justify-center rounded-sm"
        style={{ background: '#EEF2E9', border: '2px dashed #A8B99A' }}
      >
        <span className="text-3xl mb-2">📷</span>
        <p className="font-handwritten text-xs text-secondary text-center px-2">
          Add: {photo.id}.jpeg
        </p>
        <p className="font-handwritten text-xs text-secondary/60 text-center px-2 mt-1">
          {photo.description}
        </p>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="font-handwritten text-xs text-secondary">{photo.caption}</p>
      </div>
    </div>
  );
}

// ── Single polaroid photo card ──
function PolaroidCard({ photo, onClick, index }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => setError(true);
  const handleLoad = () => setLoaded(true);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: photo.rotation }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
        whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(photo)}
        className="cursor-pointer"
      >
        <PlaceholderCard photo={photo} rotation={photo.rotation} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: photo.rotation }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(photo)}
      className="cursor-pointer select-none"
      style={{ transform: `rotate(${photo.rotation}deg)` }}
    >
      <div className="bg-white p-3 pb-10 shadow-md relative">
        {/* Tape strip */}
        <div
          className="absolute -top-3 left-1/2 w-12 h-5 rounded-sm opacity-75 z-10"
          style={{ background: '#F5DF8B', transform: 'translateX(-50%) rotate(-2deg)' }}
        />

        {/* Image */}
        <div className="relative overflow-hidden">
          {!loaded && (
            <div
              className="w-full aspect-[3/4] animate-pulse rounded-sm"
              style={{ background: '#EEF2E9' }}
            />
          )}
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className={`w-full object-cover object-center transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            style={{ aspectRatio: '3/4' }}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>

        {/* Caption */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="font-handwritten text-xs text-secondary">{photo.caption}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Thela dramatic reveal ──
function ThelaReveal({ photo, onClick }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="text-center">
      <motion.div
        className="inline-block mb-4 px-4 py-2 rounded-2xl"
        style={{ background: '#34382F', color: '#F5DF8B' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="font-display text-lg">{gallery.thelaDramaticText}</p>
      </motion.div>

      {!revealed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <button
            className="btn-secondary text-lg py-4 px-8"
            onClick={() => setRevealed(true)}
          >
            🎭 REVEAL THE MOMENT
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="cursor-pointer inline-block"
          onClick={() => onClick(photo)}
        >
          <div className="bg-white p-4 pb-14 shadow-xl inline-block relative"
            style={{ transform: 'rotate(1deg)' }}>
            {/* Double tape */}
            <div className="absolute -top-3 left-6 w-10 h-5 rounded-sm opacity-75"
              style={{ background: '#F5DF8B', transform: 'rotate(-3deg)' }} />
            <div className="absolute -top-3 right-6 w-10 h-5 rounded-sm opacity-75"
              style={{ background: '#A8B99A', transform: 'rotate(2deg)' }} />

            {photo ? (
              <>
                {/* Try to load actual photo, show placeholder if missing */}
                <PhotoWithFallback photo={photo} />
              </>
            ) : (
              <div
                className="w-64 h-64 flex flex-col items-center justify-center"
                style={{ background: '#EEF2E9', border: '2px dashed #A8B99A' }}
              >
                <span className="text-4xl mb-2">🛺</span>
                <p className="font-handwritten text-sm text-secondary text-center px-4">
                  Add: thela.jpeg
                </p>
              </div>
            )}

            <div className="absolute bottom-3 left-0 right-0 text-center px-4">
              <p className="font-handwritten text-sm text-secondary leading-tight">
                {gallery.thelaCaption}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PhotoWithFallback({ photo }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="w-64 h-64 flex flex-col items-center justify-center"
        style={{ background: '#EEF2E9', border: '2px dashed #A8B99A' }}
      >
        <span className="text-4xl mb-2">🛺</span>
        <p className="font-handwritten text-sm text-secondary text-center px-4">
          Add: thela.jpeg to /public/images/special/
        </p>
      </div>
    );
  }

  return (
    <img
      src={photo.src}
      alt={photo.alt}
      className="w-64 h-64 object-cover"
      onError={() => setError(true)}
    />
  );
}

// ── Main PhotoGallery ──
function PhotoGallery() {
  const [modalPhoto, setModalPhoto] = useState(null);
  const { present, childhood, special } = photoManifest;

  return (
    <section
      id="gallery"
      className="relative py-16 px-5 overflow-hidden"
      style={{ background: '#F7F6EF' }}
    >
      <FloatingDoodles section="gallery" />

      <div className="max-w-sm mx-auto relative z-10">
        <GalleryFairyLights />
        <div className="relative z-10">
          <SectionHeading
            label="📸 Evidence"
            title={gallery.heading}
          />

          {/* Present day */}
          <div className="mb-12">
            <motion.h3
              className="font-handwritten text-xl text-secondary text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ✨ {gallery.presentHeading}
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {present.map((photo, i) => (
                <PolaroidCard key={photo.id} photo={photo} index={i} onClick={setModalPhoto} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-secondary/20" />
            <span className="font-handwritten text-sm text-secondary">the archives</span>
            <div className="flex-1 h-px bg-secondary/20" />
          </div>

          {/* Childhood */}
          <div className="mb-12">
            <motion.h3
              className="font-handwritten text-xl text-secondary text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              📚 {gallery.childhoodHeading}
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {childhood.map((photo, i) => (
                <PolaroidCard key={photo.id} photo={photo} index={i} onClick={setModalPhoto} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-secondary/20" />
            <span className="font-handwritten text-sm text-secondary">🎭 the moment</span>
            <div className="flex-1 h-px bg-secondary/20" />
          </div>

          {/* Thela */}
          <ThelaReveal photo={special[0]} onClick={setModalPhoto} />
        </div>
      </div>

      {/* Photo modal */}
      <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
    </section>
  );
}

export default PhotoGallery;
