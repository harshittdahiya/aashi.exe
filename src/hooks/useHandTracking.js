// ─── useHandTracking Hook ───
// Wraps MediaPipe Tasks Vision Hand Landmarker for browser-based hand tracking.

import { useRef, useState, useCallback, useEffect } from 'react';
import { smoothPosition } from '../utils/animationHelpers';
import { detectOpenPalm, getPalmCenter, getPalmSize } from '../utils/handTracking';

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
  const modelPromiseRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const smoothedPos = useRef(null);
  const lastVideoTime = useRef(-1);
  const requestIdRef = useRef(0);
  const activeRef = useRef(false);

  // ── Load model ──
  const loadModel = useCallback(async (requestId) => {
    if (landmarkerRef.current) return true;

    let modelPromise = modelPromiseRef.current;
    try {
      if (!modelPromise) {
        setState(HandTrackingState.LOADING);
        modelPromise = (async () => {
          const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
          );
          const landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 1,
          });

          if (!activeRef.current) {
            landmarker.close();
            return false;
          }

          landmarkerRef.current = landmarker;
          return true;
        })();
        modelPromiseRef.current = modelPromise;
      }

      const modelReady = await modelPromise;
      if (modelPromiseRef.current === modelPromise) modelPromiseRef.current = null;
      if (requestId !== requestIdRef.current) return false;
      if (!modelReady || !landmarkerRef.current) {
        return activeRef.current ? loadModel(requestId) : false;
      }

      setState(HandTrackingState.READY);
      return true;
    } catch (err) {
      if (modelPromiseRef.current === modelPromise) modelPromiseRef.current = null;
      if (requestId !== requestIdRef.current) return false;
      console.error('Hand Landmarker load error:', err);
      setErrorMessage('Could not load hand tracking model.');
      setState(HandTrackingState.MODEL_ERROR);
      return false;
    }
  }, []);

  // ── Start camera ──
  const startCamera = useCallback(async (videoElement, requestId) => {
    if (!videoElement) return false;
    videoRef.current = videoElement;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return false;
      }

      streamRef.current = stream;
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', '');
      await videoElement.play();

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return false;
      }

      return true;
    } catch (err) {
      if (requestId !== requestIdRef.current) return false;
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
        const aspectRatio = video.videoWidth / video.videoHeight || 1;
        const isOpen = detectOpenPalm(landmarks, aspectRatio);
        const rawCenter = getPalmCenter(landmarks);
        const palmSize = getPalmSize(landmarks, aspectRatio);

        smoothedPos.current = smoothedPos.current
          ? smoothPosition(smoothedPos.current, rawCenter, 0.2)
          : rawCenter;

        setHandData({
          palmCenter: smoothedPos.current,
          palmSize,
          isOpen,
          landmarks,
        });
      } else {
        smoothedPos.current = null;
        setHandData(null);
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, []);

  // ── Stop everything ──
  const stop = useCallback(() => {
    requestIdRef.current++;
    activeRef.current = false;

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
    smoothedPos.current = null;
    setHandData(null);
    setState(HandTrackingState.IDLE);
  }, []);

  // ── Initialize: load model + start camera + tracking ──
  const initialize = useCallback(async (videoElement) => {
    const requestId = ++requestIdRef.current;
    activeRef.current = true;
    const modelOk = await loadModel(requestId);
    if (!modelOk || requestId !== requestIdRef.current) return;

    const cameraOk = await startCamera(videoElement, requestId);
    if (!cameraOk || requestId !== requestIdRef.current) return;

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
