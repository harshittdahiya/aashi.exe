// ─── useAudio Hook ───
// Creates and manages a persistent audio instance.
// The audio element lives for the lifetime of the application.

import { useRef, useState, useEffect, useCallback } from 'react';

const AUDIO_SRC = '/audio/birthday-song.mp3';

// Singleton audio element shared across the app
let globalAudio = null;

function getOrCreateAudio() {
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.loop = true;
    globalAudio.volume = 0.7;
    globalAudio.preload = 'metadata';
  }
  return globalAudio;
}

export function useAudio() {
  const audioRef = useRef(getOrCreateAudio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set the src once
  useEffect(() => {
    const audio = audioRef.current;

    // Check if already has correct src
    if (!audio.src || !audio.src.includes('birthday-song.mp3')) {
      audio.src = AUDIO_SRC;
    }

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = (e) => {
      // 404 or missing file — graceful unavailable state
      const code = e.target?.error?.code;
      if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || code === MediaError.MEDIA_ERR_NETWORK) {
        setIsAvailable(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  /**
   * Attempt to play audio — must be called inside a user gesture handler.
   * Returns true if playback started, false if blocked.
   */
  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!isAvailable) return false;

    try {
      await audio.play();
      setIsPlaying(true);
      setIsBlocked(false);
      return true;
    } catch (err) {
      // NotAllowedError = browser blocked autoplay
      if (err.name === 'NotAllowedError') {
        setIsBlocked(true);
      } else {
        // Other errors (src missing, etc.)
        setIsAvailable(false);
      }
      return false;
    }
  }, [isAvailable]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!isAvailable) return;

    if (audio.paused) {
      await attemptPlay();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isAvailable, attemptPlay]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const seekTo = useCallback((pct) => {
    const audio = audioRef.current;
    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = (pct / 100) * audio.duration;
    }
  }, []);

  return {
    isPlaying,
    isMuted,
    progress,
    duration,
    isAvailable,
    isBlocked,
    isLoaded,
    attemptPlay,
    togglePlay,
    toggleMute,
    seekTo,
    dismissBlocked: () => setIsBlocked(false),
  };
}

export default useAudio;
