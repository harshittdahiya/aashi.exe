// ─── App.jsx ───
// Root application — manages landing → birthday transition.
// Owns the audio instance so it persists across page changes.

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAudio } from './hooks/useAudio';
import LandingPage from './pages/LandingPage';
import BirthdayExperience from './pages/BirthdayExperience';
import LoadingScreen from './components/common/LoadingScreen';

function App() {
  const [appState, setAppState] = useState('loading'); // loading | landing | birthday
  const { attemptPlay, isBlocked, dismissBlocked } = useAudio();

  const handleLoadComplete = () => {
    setAppState('landing');
  };

  const handleSuccess = () => {
    setAppState('birthday');
    // Scroll to top for the birthday experience
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <LoadingScreen key="loading" onComplete={handleLoadComplete} />
        )}

        {appState === 'landing' && (
          <LandingPage
            key="landing"
            onSuccess={handleSuccess}
            attemptPlay={attemptPlay}
          />
        )}

        {appState === 'birthday' && (
          <BirthdayExperience
            key="birthday"
            isBlocked={isBlocked}
            onDismissBlocked={dismissBlocked}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
