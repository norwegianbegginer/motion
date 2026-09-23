export type LandmarkName = "nose" | "leftEyeInner" | "leftEye" | "leftEyeOuter" | "rightEyeInner" | "rightEye" | "rightEyeOuter" | "leftEar" | "rightEar" | "mouthLeft" | "mouthRight" | "leftShoulder" | "rightShoulder" | "leftElbow" | "rightElbow" | "leftWrist" | "rightWrist" | "leftPinky" | "rightPinky" | "leftIndex" | "rightIndex" | "leftThumb" | "rightThumb" | "leftHip" | "rightHip" | "leftKnee" | "rightKnee" | "leftAnkle" | "rightAnkle" | "leftHeel" | "rightHeel" | "leftFootIndex" | "rightFootIndex";
export interface Landmark { x: number; y: number; z?: number; confidence: number; }
export interface PoseResult { landmarks: Partial<Record<LandmarkName, Landmark>>; timestamp: number; }
export type TrackingSide = "left" | "right" | "auto";
export interface PoseEstimator { initialize(): Promise<void>; estimate(source: HTMLVideoElement): Promise<PoseResult | null>; dispose(): Promise<void>; readonly provider: string; readonly mode: "LIVE MODEL" | "MOCK MODE"; }
