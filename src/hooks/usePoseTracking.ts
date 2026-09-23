import { useCallback, useEffect, useRef, useState } from "react";
import { calculateAngle } from "../biomechanics/angles";
import { hasConfidentLandmarks } from "../biomechanics/confidence";
import { createEmaSmoother } from "../biomechanics/smoothing";
import { MIN_LANDMARK_CONFIDENCE } from "../config/pose";
import { SquatEngine } from "../exercises/squat/squatEngine";
import type { SquatSnapshot } from "../exercises/squat/types";
import type { LandmarkName, PoseEstimator, PoseResult, TrackingSide } from "../pose/types";

export function usePoseTracking(video: React.RefObject<HTMLVideoElement>, estimator: PoseEstimator | null, side: TrackingSide, active: boolean) {
  const [pose, setPose] = useState<PoseResult | null>(null), [angle, setAngle] = useState<number | null>(null), [snapshot, setSnapshot] = useState<SquatSnapshot>(() => new SquatEngine().update(null)), [fps, setFps] = useState(0), [ready, setReady] = useState(false), [message, setMessage] = useState("Start the camera to begin.");
  const engine = useRef(new SquatEngine()), smoother = useRef(createEmaSmoother()), running = useRef(false), frames = useRef(0), lastFps = useRef(performance.now());
  const reset = useCallback(() => { engine.current.reset(); smoother.current.reset(); setSnapshot(engine.current.update(null)); setAngle(null); setPose(null); setMessage("Ready when you are."); }, []);
  useEffect(() => {
    if (!active || !estimator || !video.current) return; let raf = 0;
    const loop = async () => { raf = requestAnimationFrame(loop); if (running.current || !video.current?.videoWidth) return; running.current = true;
      try { const raw = await estimator.estimate(video.current); setPose(raw); const landmarks = raw ? smoother.current.update(raw.landmarks) : {};
        const names: LandmarkName[] = side === "left" ? ["leftHip", "leftKnee", "leftAnkle"] : side === "right" ? ["rightHip", "rightKnee", "rightAnkle"] : ["leftHip", "leftKnee", "leftAnkle"];
        if (hasConfidentLandmarks(landmarks, names, MIN_LANDMARK_CONFIDENCE)) { const [h, k, ankle] = names.map((n) => landmarks[n]!); const a = calculateAngle(h, k, ankle); setAngle(a); setSnapshot(engine.current.update(a, performance.now())); setMessage("Good tracking"); } else { setAngle(null); setMessage("Body not clearly detected"); }
        const body: LandmarkName[] = ["leftShoulder", "rightShoulder", "leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"]; setReady(!!raw && hasConfidentLandmarks(raw.landmarks, body, MIN_LANDMARK_CONFIDENCE)); frames.current++; const now = performance.now(); if (now - lastFps.current > 1000) { setFps(frames.current * 1000 / (now - lastFps.current)); frames.current = 0; lastFps.current = now; }
      } catch (e) { setMessage(e instanceof Error ? e.message : "Pose estimation failed"); } finally { running.current = false; }
    }; loop(); return () => cancelAnimationFrame(raf);
  }, [active, estimator, side, video]);
  return { pose, angle, snapshot, fps, ready, message, reset };
}
