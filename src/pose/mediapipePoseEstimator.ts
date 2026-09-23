import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import type { LandmarkName, PoseEstimator, PoseResult } from "./types";

const MODEL_URL = `${import.meta.env.BASE_URL}models/pose_landmarker_full.task`;
const WASM_URL = `${import.meta.env.BASE_URL}mediapipe`;
const indices: Partial<Record<LandmarkName, number>> = { nose: 0, leftEyeInner: 1, leftEye: 2, leftEyeOuter: 3, rightEyeInner: 4, rightEye: 5, rightEyeOuter: 6, leftEar: 7, rightEar: 8, mouthLeft: 9, mouthRight: 10, leftShoulder: 11, rightShoulder: 12, leftElbow: 13, rightElbow: 14, leftWrist: 15, rightWrist: 16, leftPinky: 17, rightPinky: 18, leftIndex: 19, rightIndex: 20, leftThumb: 21, rightThumb: 22, leftHip: 23, rightHip: 24, leftKnee: 25, rightKnee: 26, leftAnkle: 27, rightAnkle: 28, leftHeel: 29, rightHeel: 30, leftFootIndex: 31, rightFootIndex: 32 };

export class MediaPipePoseEstimator implements PoseEstimator {
  private landmarker?: PoseLandmarker;
  readonly mode = "LIVE MODEL" as const;
  provider = "MediaPipe CPU";

  async initialize() {
    const vision = await FilesetResolver.forVisionTasks(WASM_URL);
    try {
      this.landmarker = await PoseLandmarker.createFromOptions(vision, this.options("GPU"));
      this.provider = "MediaPipe GPU";
    } catch (gpuError) {
      console.info("MediaPipe GPU unavailable; falling back to CPU", gpuError);
      this.landmarker = await PoseLandmarker.createFromOptions(vision, this.options("CPU"));
      this.provider = "MediaPipe CPU";
    }
  }

  private options(delegate: "GPU" | "CPU") {
    return { baseOptions: { modelAssetPath: MODEL_URL, delegate }, runningMode: "VIDEO" as const, numPoses: 1, minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5, minTrackingConfidence: 0.5 };
  }

  async estimate(source: HTMLVideoElement): Promise<PoseResult | null> {
    if (!this.landmarker || !source.videoWidth) return null;
    const result = this.landmarker.detectForVideo(source, Math.round(performance.now()));
    const pose = result.landmarks[0];
    if (!pose) return null;
    const landmarks: PoseResult["landmarks"] = {};
    for (const [name, index] of Object.entries(indices) as [LandmarkName, number][]) {
      const point = pose[index];
      if (point) landmarks[name] = { x: point.x, y: point.y, z: point.z, confidence: Math.min(point.visibility ?? 1, 1) };
    }
    return { landmarks, timestamp: performance.now() };
  }

  async dispose() { this.landmarker?.close(); this.landmarker = undefined; }
}
