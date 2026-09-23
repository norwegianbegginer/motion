export type SquatPhase = "standing"|"descending"|"bottom"|"ascending";
export interface RepMetrics { repNumber:number; minKneeAngle:number; maxKneeAngle:number; rangeOfMotion:number; durationMs:number; }
export interface SquatSnapshot { phase:SquatPhase; reps:number; currentRepMin:number|null; bestDepth:number|null; averageDepth:number|null; averageRepDuration:number|null; lastRep:RepMetrics|null; }
