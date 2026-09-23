import type { Landmark, LandmarkName } from "../pose/types";
export function hasConfidentLandmarks(landmarks: Partial<Record<LandmarkName,Landmark>>, names: LandmarkName[], threshold: number) { return names.every((name) => { const p=landmarks[name]; return !!p && p.confidence >= threshold; }); }
