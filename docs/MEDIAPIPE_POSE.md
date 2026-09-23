# MediaPipe pose model

The active pose adapter is `src/pose/mediapipePoseEstimator.ts`.

It uses `@mediapipe/tasks-vision`, local runtime files under `public/mediapipe/`, and the official full model bundle:

```text
public/models/pose_landmarker_full.task
```

MediaPipe returns 33 normalized landmarks. The adapter maps these indices:

```text
0  nose
11 left shoulder     12 right shoulder
23 left hip          24 right hip
25 left knee         26 right knee
27 left ankle        28 right ankle
```

MediaPipe GPU is attempted first. If the browser cannot create the GPU delegate, the adapter retries with the CPU delegate. The downstream smoothing, angle calculation, readiness check, squat state machine, and UI do not depend on MediaPipe’s raw result shape.
