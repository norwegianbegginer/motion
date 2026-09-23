import { useEffect, useRef, useState } from "react";
import { startCamera, stopCamera } from "./camera/camera";
import { MetricsPanel } from "./components/MetricsPanel";
import { PoseOverlay } from "./components/PoseOverlay";
import { StatusPanel } from "./components/StatusPanel";
import { MockPoseEstimator } from "./pose/mockPoseEstimator";
import { MediaPipePoseEstimator } from "./pose/mediapipePoseEstimator";
import type { PoseEstimator, TrackingSide } from "./pose/types";
import { usePoseTracking } from "./hooks/usePoseTracking";

export default function App() {
  const video = useRef<HTMLVideoElement>(null);
  const [estimator, setEstimator] = useState<PoseEstimator | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [side, setSide] = useState<TrackingSide>("auto");
  const [error, setError] = useState("");
  const [useMock, setUseMock] = useState(false);
  const tracking = usePoseTracking(video, estimator, side, cameraOn);

  const estimatorRef = useRef<PoseEstimator | null>(null);
  useEffect(() => () => { stopCamera(video.current?.srcObject as MediaStream | undefined); void estimatorRef.current?.dispose(); }, []);

  async function begin() {
    setError("");
    let next: PoseEstimator = useMock ? new MockPoseEstimator() : new MediaPipePoseEstimator();
    try {
      await next.initialize();
    } catch (e) {
      if (!useMock) { await next.dispose(); next = new MockPoseEstimator(); await next.initialize(); setError("MediaPipe model unavailable; running MOCK MODE."); }
      else { setError(e instanceof Error ? e.message : "Unable to initialize pose model"); setCameraOn(false); return; }
    }
    try { await startCamera(video.current!); estimatorRef.current = next; setEstimator(next); setCameraOn(true); }
    catch (e) { await next.dispose(); setError(e instanceof Error ? e.message : "Unable to start camera"); setCameraOn(false); }
  }

  return <main>
    <header><div><h1>Physiotherapy Motion MVP</h1><p className="privacy">Video is processed locally in your browser and is not uploaded.</p></div><div className="controls"><label>Tracking <select value={side} onChange={e => setSide(e.target.value as TrackingSide)}><option value="auto">Auto</option><option value="left">Left</option><option value="right">Right</option></select></label><label className="check"><input type="checkbox" checked={useMock} onChange={e => setUseMock(e.target.checked)} /> Mock mode</label></div></header>
    <div className="badges"><StatusPanel message={error || tracking.message} provider={estimator?.provider ?? "—"} mode={estimator?.mode ?? "—"} /></div>
    <div className="workspace"><div className="camera"><video ref={video} autoPlay muted playsInline className="video" /><PoseOverlay pose={tracking.pose} angle={tracking.angle} side={side} />{cameraOn && !tracking.ready && <div className="hint">Position yourself so your full body is visible</div>}</div><MetricsPanel s={tracking.snapshot} angle={tracking.angle} fps={tracking.fps} /></div>
    <div className="actions"><button onClick={begin} disabled={cameraOn}>Start camera</button><button className="secondary" onClick={tracking.reset}>Reset session</button></div>
    <p className="note">Prototype measurement only — not a medical device. 2D angles are not clinical goniometry.</p>
  </main>;
}
