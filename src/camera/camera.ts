export async function startCamera(video: HTMLVideoElement): Promise<MediaStream> {
  if (!window.isSecureContext && location.hostname !== "localhost") throw new Error("Camera access requires localhost or HTTPS.");
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser does not support webcam access.");
  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, audio: false });
  const track = stream.getVideoTracks()[0];
  if (!track) { stopCamera(stream); throw new Error("No camera video track was returned."); }
  video.autoplay = true; video.muted = true; video.playsInline = true; video.srcObject = stream;
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("Camera did not provide video frames. Check browser camera permission and that no other app is using the camera.")), 5000);
    video.onloadedmetadata = () => { window.clearTimeout(timeout); resolve(); };
    video.onerror = () => { window.clearTimeout(timeout); reject(new Error("The camera video element failed to load.")); };
  });
  await video.play();
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0) { stopCamera(stream); throw new Error("Camera opened but returned no video frames. Check camera permission and device availability."); }
  return stream;
}
export function stopCamera(stream?: MediaStream) { stream?.getTracks().forEach((track) => track.stop()); }
