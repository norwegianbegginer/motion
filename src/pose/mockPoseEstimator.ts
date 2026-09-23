import type { PoseEstimator, PoseResult, LandmarkName } from "./types";
export class MockPoseEstimator implements PoseEstimator {
  readonly provider = "Mock" as const; readonly mode = "MOCK MODE" as const; private started = performance.now();
  async initialize() {};
  async estimate(): Promise<PoseResult> { const t = (performance.now() - this.started) / 1000; const bend = (Math.sin(t * 1.2) + 1) / 2; const names: Partial<Record<LandmarkName, [number,number]>> = { nose:[.5,.12],leftShoulder:[.42,.2],rightShoulder:[.58,.2],leftHip:[.43,.45],rightHip:[.57,.45],leftKnee:[.42,.62-.14*bend],rightKnee:[.58,.62-.14*bend],leftAnkle:[.42,.88],rightAnkle:[.58,.88] }; return { timestamp: performance.now(), landmarks: Object.fromEntries(Object.entries(names).map(([name,[x,y]]) => [name,{x,y,confidence:.98}])) as PoseResult["landmarks"] }; }
  async dispose() {}
}
