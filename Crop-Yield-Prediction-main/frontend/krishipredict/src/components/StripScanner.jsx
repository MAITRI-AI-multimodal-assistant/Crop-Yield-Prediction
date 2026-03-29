import { useState, useRef } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_EXPRESS_URL || "http://localhost:5000";

export default function StripScanner({ parameter, onResult }) {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const PARAM_LABELS = { N: "Nitrogen", P: "Phosphorus", K: "Potassium", ph: "pH" };
  const PARAM_COLORS = { N: "#27ae60", P: "#2980b9", K: "#8e44ad", ph: "#e67e22" };

  const openCamera = async () => {
    setError("");
    setResult(null);
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      // Fallback to file upload
      setScanning(false);
      fileRef.current?.click();
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.8);
    closeCamera();
    sendToAPI(base64);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setScanning(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => sendToAPI(ev.target.result);
    reader.readAsDataURL(file);
  };

  const sendToAPI = async (base64) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${BASE}/api/scan-strip`, {
        image: base64,
        parameter,
      }, {
        headers: { Authorization: "Bearer " + localStorage.getItem("kp_token") },
      });
      setResult(data);
      onResult(data.value);
    } catch (err) {
      setError("Scan failed. Try again or enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const color = PARAM_COLORS[parameter] || "#00a651";

  return (
    <>
      <button
        type="button"
        onClick={openCamera}
        disabled={loading}
        style={{
          padding: "0.4rem 0.65rem",
          background: loading ? "#0d1810" : `${color}22`,
          border: `1.5px solid ${color}44`,
          borderRadius: 8,
          color,
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          whiteSpace: "nowrap",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {loading ? <span className="spinner" style={{ borderColor: `${color}44`, borderTopColor: color, width: 14, height: 14 }} /> : "📷"}
        {loading ? "Analyzing..." : "Scan Strip"}
      </button>

      <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

      {result && (
        <span style={{
          fontSize: "0.78rem",
          padding: "0.2rem 0.5rem",
          background: `${color}18`,
          color,
          borderRadius: 6,
          fontWeight: 600,
        }}>
          ✓ {result.value} {result.unit} ({result.confidence})
        </span>
      )}

      {error && <span style={{ fontSize: "0.75rem", color: "#e05252" }}>{error}</span>}

      {/* Camera modal */}
      {scanning && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, flexDirection: "column", gap: "1rem",
        }}>
          <div style={{ color: "white", fontSize: "1rem", fontWeight: 600 }}>
            📷 Scanning {PARAM_LABELS[parameter] || parameter} Strip
          </div>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
            <video ref={videoRef} autoPlay playsInline style={{ maxWidth: "90vw", maxHeight: "60vh", display: "block" }} />
            {/* Targeting overlay */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120, height: 200,
              border: `3px solid ${color}`,
              borderRadius: 8,
              boxShadow: `0 0 0 2000px rgba(0,0,0,0.4)`,
            }} />
            <div style={{
              position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
              color: "white", fontSize: "0.8rem", background: "rgba(0,0,0,0.6)",
              padding: "4px 12px", borderRadius: 100,
            }}>
              Place strip inside the box
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={capturePhoto} style={{
              padding: "0.75rem 2rem", background: color, color: "white",
              border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer",
              fontSize: "1rem", fontFamily: "'DM Sans', sans-serif",
            }}>
              📸 Capture
            </button>
            <button onClick={closeCamera} style={{
              padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.15)", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
