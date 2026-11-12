// ─── useHandTracking Hook ───
// Wraps MediaPipe Tasks Vision Hand Landmarker for browser-based hand tracking.

import { useRef, useState, useCallback, useEffect } from 'react';
import { smoothPosition } from '../utils/animationHelpers';

// MediaPipe model CDN path
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export const HandTrackingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  TRACKING: 'tracking',
  PERMISSION_DENIED: 'permission_denied',
  CAMERA_ERROR: 'camera_error',
  MODEL_ERROR: 'model_error',
  UNSUPPORTED: 'unsupported',
};

export function useHandTracking() {
  const [state, setState] = useState(HandTrackingState.IDLE);
  const [handData, setHandData] = useState(null); // { palmCenter, palmSize, isOpen, landmarks }
  const [errorMessage, setErrorMessage] = useState('');

  const landmarkerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const smoothedPos = useRef({ x: 0, y: 0 });
  const lastVideoTime = useRef(-1);

  // ── Load model ──
  const loadModel = useCallback(async () => {
    if (landmarkerRef.current) return true;

    try {
      setState(HandTrackingState.LOADING);

      const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
      );

      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });

      setState(HandTrackingState.READY);
      return true;
    } catch (err) {
      console.error('Hand Landmarker load error:', err);
      setErrorMessage('Could not load hand tracking model.');
      setState(HandTrackingState.MODEL_ERROR);
      return false;
    }
  }, []);

  // ── Start camera ──
  const startCamera = useCallback(async (videoElement) => {
    if (!videoElement) return false;
    videoRef.current = videoElement;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', '');

      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = resolve;
        videoElement.onerror = reject;
      });

      await videoElement.play();
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setState(HandTrackingState.PERMISSION_DENIED);
        setErrorMessage('Camera permission denied.');
      } else {
        setState(HandTrackingState.CAMERA_ERROR);
        setErrorMessage('Camera unavailable on this device.');
      }
      return false;
    }
  }, []);

  // ── Detect open palm ──
  function detectOpenPalm(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;

    // Fingertip indices: thumb=4, index=8, middle=12, ring=16, pinky=20
    // MCP (knuckle) indices: index=5, middle=9, ring=13, pinky=17
    const fingerTips = [8, 12, 16, 20];
    const fingerMCPs = [5, 9, 13, 17];

    // Count extended fingers
    let extendedCount = 0;
    for (let i = 0; i < fingerTips.length; i++) {
      const tip = landmarks[fingerTips[i]];
      const mcp = landmarks[fingerMCPs[i]];
      if (tip.y < mcp.y) extendedCount++; // y decreases upward in normalized coords
    }

    // Thumb check (tip vs IP joint)
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const thumbExtended = Math.abs(thumbTip.x - thumbIP.x) > 0.05;

    return extendedCount >= 3; // 3+ fingers extended = open palm
  }

  // ── Calculate palm center ──
  function getPalmCenter(landmarks) {
    // Use wrist (0) and middle finger MCP (9) for stable center
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];
    return {
      x: (wrist.x + middleMCP.x) / 2,
      y: (wrist.y + middleMCP.y) / 2,
    };
  }

  // ── Calculate palm size ──
  function getPalmSize(landmarks) {
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];
    const dx = wrist.x - middleMCP.x;
    const dy = wrist.y - middleMCP.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ── Tracking loop ──
  const startTracking = useCallback(() => {
    if (!landmarkerRef.current || !videoRef.current) return;

    setState(HandTrackingState.TRACKING);

    const detect = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (!video || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const now = performance.now();
      if (video.currentTime === lastVideoTime.current) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      lastVideoTime.current = video.currentTime;

      let result;
      try {
        result = landmarker.detectForVideo(video, now);
      } catch {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (result?.landmarks?.length > 0) {
        const landmarks = result.landmarks[0];
        const isOpen = detectOpenPalm(landmarks);
        const rawCenter = getPalmCenter(landmarks);
        const palmSize = getPalmSize(landmarks);

        // Smooth position
        smoothedPos.current = smoothPosition(smoothedPos.current, rawCenter, 0.2);

        setHandData({
          palmCenter: smoothedPos.current,
          palmSize,
          isOpen,
          landmarks,
        });
      } else {
        setHandData(null);
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, []);

  // ── Stop everything ──
  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause?.();
      videoRef.current.srcObject = null;
    }

    // Release MediaPipe resources as well as the camera stream.
    if (landmarkerRef.current) {
      try {
        landmarkerRef.current.close();
      } catch (error) {
        console.warn('Could not close hand landmarker cleanly:', error);
      }
      landmarkerRef.current = null;
    }

    lastVideoTime.current = -1;
    smoothedPos.current = { x: 0, y: 0 };
    setHandData(null);
    setState(HandTrackingState.IDLE);
  }, []);

  // ── Initialize: load model + start camera + tracking ──
  const initialize = useCallback(async (videoElement) => {
    const modelOk = await loadModel();
    if (!modelOk) return;

    const cameraOk = await startCamera(videoElement);
    if (!cameraOk) return;

    startTracking();
  }, [loadModel, startCamera, startTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    state,
    handData,
    errorMessage,
    initialize,
    stop,
    videoRef,
  };
}

export default useHandTracking;
