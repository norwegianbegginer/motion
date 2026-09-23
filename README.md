# Physiotherapy Motion MVP

This browser-only prototype measures squats locally:

`webcam → MediaPipe Pose Landmarker → normalized landmarks → biomechanics → squat counter`

## Setup

```bash
npm install
npm run dev
```

Checks:

```bash
npm test
npm run build
```

## GitHub Pages

Enable Pages using **Settings → Pages → Build and deployment → Source: GitHub Actions**. The included workflow runs on `master`, builds with the repository subpath as Vite’s base URL, and deploys the static site automatically. For this repository, the expected URL is `https://norwegianbegginer.github.io/motion/`. Webcam access works on the resulting HTTPS URL. If using a custom domain, set `VITE_BASE_PATH=/` in the workflow.

The app uses Google MediaPipe Tasks Vision with the full Pose Landmarker model stored at `public/models/pose_landmarker_full.task`. The model produces 33 body landmarks; the app maps the required shoulders, hips, knees, ankles, and nose into its normalized pose layer. It tries the MediaPipe GPU delegate first and falls back to the CPU delegate.

Webcam access requires localhost or HTTPS. Frames are processed locally and are never uploaded, recorded, persisted, or sent to an API. The bundled model and MediaPipe WASM runtime are local assets.

If the model cannot initialize, the app falls back visibly to `MOCK MODE`; mock landmarks are synthetic and are only for testing the UI and squat engine.

This is a prototype, not a medical device. Pose estimates may be inaccurate; camera position affects measurements; 2D joint angles are not clinical goniometry; and feedback is deterministic prototype logic.
