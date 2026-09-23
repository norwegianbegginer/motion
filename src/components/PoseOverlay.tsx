import { useEffect, useRef } from "react";
import type { LandmarkName, PoseResult, TrackingSide } from "../pose/types";
import { toCanvasPoint } from "../utils/geometry";

const connections: [LandmarkName, LandmarkName][] = [
  ["nose", "leftEye"], ["leftEye", "leftEyeInner"], ["leftEye", "leftEyeOuter"], ["leftEyeOuter", "leftEar"], ["nose", "rightEye"], ["rightEye", "rightEyeInner"], ["rightEye", "rightEyeOuter"], ["rightEyeOuter", "rightEar"], ["mouthLeft", "mouthRight"],
  ["leftShoulder", "rightShoulder"], ["leftShoulder", "leftElbow"], ["leftElbow", "leftWrist"], ["leftWrist", "leftPinky"], ["leftWrist", "leftIndex"], ["leftWrist", "leftThumb"], ["rightShoulder", "rightElbow"], ["rightElbow", "rightWrist"], ["rightWrist", "rightPinky"], ["rightWrist", "rightIndex"], ["rightWrist", "rightThumb"],
  ["leftShoulder", "leftHip"], ["rightShoulder", "rightHip"], ["leftHip", "rightHip"], ["leftHip", "leftKnee"], ["leftKnee", "leftAnkle"], ["leftAnkle", "leftHeel"], ["leftHeel", "leftFootIndex"], ["leftAnkle", "leftFootIndex"], ["rightHip", "rightKnee"], ["rightKnee", "rightAnkle"], ["rightAnkle", "rightHeel"], ["rightHeel", "rightFootIndex"], ["rightAnkle", "rightFootIndex"]
];

export function PoseOverlay({ pose, angle, side, mirrored = true }: { pose: PoseResult | null; angle: number | null; side: TrackingSide; mirrored?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d"); if (!ctx) return; ctx.scale(dpr, dpr); ctx.clearRect(0, 0, rect.width, rect.height); if (!pose) return;
    const point = (name: LandmarkName) => { const landmark = pose.landmarks[name]; return landmark && landmark.confidence >= 0.5 ? toCanvasPoint(landmark.x, landmark.y, rect.width, rect.height, mirrored) : null; };
    ctx.lineWidth = 2; ctx.strokeStyle = "#57d6b2";
    for (const [a, b] of connections) { if (side !== "auto" && ((side === "left" && (a.startsWith("right") || b.startsWith("right"))) || (side === "right" && (a.startsWith("left") || b.startsWith("left"))))) continue; const p1 = point(a), p2 = point(b); if (p1 && p2) { ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } }
    for (const [name, landmark] of Object.entries(pose.landmarks)) { if (landmark.confidence < 0.5) continue; const q = toCanvasPoint(landmark.x, landmark.y, rect.width, rect.height, mirrored); ctx.fillStyle = name.includes("Wrist") || name.includes("Index") || name.includes("Thumb") || name.includes("Pinky") ? "#ffd166" : "#fff"; ctx.beginPath(); ctx.arc(q.x, q.y, 4, 0, Math.PI * 2); ctx.fill(); if (name.includes("Knee") && angle !== null) { ctx.fillStyle = "#dffaf3"; ctx.font = "bold 14px sans-serif"; ctx.fillText(`${Math.round(angle)}°`, q.x + 8, q.y - 8); } }
  }, [pose, angle, side, mirrored]);
  return <canvas className="overlay" ref={ref} />;
}
