
import React, { useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c12; --surface: #0e1520; --surface2: #141c2b;
    --border: rgba(99,179,255,0.12); --accent: #3b9eff; --accent2: #00e5c0;
    --text: #e8f0ff; --muted: #5a6a80; --danger: #ff5e7a;
    --glow: rgba(59,158,255,0.2);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
  }

  body::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(59,158,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,158,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

  .frame-thumb {
    animation: fadeIn 0.3s ease;
    width: 90px; height: 90px;
    border-radius: 10px;
    border: 1px solid var(--border);
    object-fit: cover;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .frame-thumb:hover { border-color: var(--accent2); transform: scale(1.07); }
`;

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const loopRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [word, setWord] = useState("");
  const [sentence, setSentence] = useState("");
  const [frames, setFrames] = useState([]);
  const [lastFrame, setLastFrame] = useState(null);

  const startCamera = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    setIsRunning(true);

    loopRef.current = setInterval(() => {

      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = 224;
      canvas.height = 224;

      ctx.drawImage(videoRef.current, 0, 0, 224, 224);

      const frame = canvas.toDataURL("image/jpeg");

      console.log("AUTO FRAME:", frame);

    }, 300);

  };

  const stopCamera = () => {

    const tracks = videoRef.current.srcObject?.getTracks() || [];
    tracks.forEach(t => t.stop());

    videoRef.current.srcObject = null;

    clearInterval(loopRef.current);

    setIsRunning(false);

  };
  const predict = async () => {
    if (!isRunning) return;
    const res = await fetch("https://YOUR-RENDER-BACKEND/predict");
    const data = await res.json();
    setWord(data.word);
    setSentence(data.sentence);
  };

  const extractFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(videoRef.current, 0, 0, 224, 224);
    const frame = canvas.toDataURL("image/jpeg");
    console.log(frame);
    setLastFrame(frame);
    setFrames(prev => [frame, ...prev].slice(0, 12));
  };
  const startPredictionLoop = () => {

    setInterval(() => {

      if (!videoRef.current || !canvasRef.current || !isRunning) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = 224;
      canvas.height = 224;

      ctx.drawImage(videoRef.current, 0, 0, 224, 224);

      const frame = canvas.toDataURL("image/jpeg");

      console.log("Auto Frame:", frame);

    }, 300);

  };

  const card = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 20, overflow: "hidden", marginBottom: "1.5rem",
    boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
  };

  const btnBase = {
    padding: "0.7rem 1rem", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--surface2)",
    color: "var(--text)", fontFamily: "'DM Mono', monospace",
    fontSize: "0.78rem", cursor: "pointer", letterSpacing: "0.05em",
    transition: "all 0.2s", flex: 1,
  };

  const sectionLabel = {
    fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
    textTransform: "uppercase", letterSpacing: "0.15em",
    color: "var(--accent)", marginBottom: "1rem",
    display: "flex", alignItems: "center", gap: "0.5rem",
  };

  const corners = [
    { top: 14, left: 14, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", borderRadius: "4px 0 0 0" },
    { top: 14, right: 14, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", borderRadius: "0 4px 0 0" },
    { bottom: 14, left: 14, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", borderRadius: "0 0 0 4px" },
    { bottom: 14, right: 14, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", borderRadius: "0 0 4px 0" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 50, height: 50, background: "linear-gradient(135deg, var(--accent), var(--accent2))", borderRadius: 14, display: "grid", placeItems: "center", fontSize: "1.6rem", boxShadow: "0 0 24px var(--glow)", flexShrink: 0 }}>🤟</div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, background: "linear-gradient(90deg, var(--text), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>SignBridge</h1>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Bidirectional Sign Recognition System</p>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--border)", color: "var(--muted)" }}>v1.0</div>
        </header>

        {/* Section: Camera */}
        <div style={sectionLabel}>
          <span>Live Camera Feed</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={card}>
          <div style={{ position: "relative", background: "#060a0f", lineHeight: 0 }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", display: "block" }} />
            {corners.map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 26, height: 26, opacity: 0.7, ...s }} />
            ))}
            {!isRunning && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(8,12,18,0.88)", gap: 8 }}>
                <div style={{ fontSize: "3rem" }}>📷</div>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Camera is off — press Start</p>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: "var(--surface2)", borderTop: "1px solid var(--border)", fontSize: "0.72rem", color: "var(--muted)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isRunning ? "#22c55e" : "var(--muted)", boxShadow: isRunning ? "0 0 8px #22c55e" : "none", animation: isRunning ? "pulse 1.5s infinite" : "none" }} />
            <span>{isRunning ? "Live" : "Inactive"}</span>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.65rem", padding: "1.2rem" }}>
            <button style={{ ...btnBase, background: "var(--accent)", borderColor: "var(--accent)", color: "#fff", boxShadow: "0 0 20px var(--glow)" }} onClick={startCamera} disabled={isRunning}>▶ Start</button>
            <button style={{ ...btnBase, background: "rgba(255,94,122,0.1)", borderColor: "rgba(255,94,122,0.3)", color: "var(--danger)" }} onClick={stopCamera} disabled={!isRunning}>■ Stop</button>
            <button style={btnBase} onClick={predict}>⬡ Predict</button>
            <button style={{ ...btnBase, background: "rgba(0,229,192,0.08)", borderColor: "rgba(0,229,192,0.25)", color: "var(--accent2)" }} onClick={extractFrame} disabled={!isRunning}>📸 Extract Frame</button>
          </div>
        </div>

        {/* Section: Output */}
        <div style={sectionLabel}>
          <span>Recognition Output</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.2rem" }}>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 8 }}>Current Word</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: word ? "var(--accent2)" : "var(--text)", transition: "color 0.3s" }}>{word || "—"}</div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.2rem" }}>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 8 }}>Last Frame</div>
            {lastFrame
              ? <img src={lastFrame} alt="last frame" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", border: "1px solid var(--accent2)" }} />
              : <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--text)" }}>—</div>}
          </div>

          <div style={{ gridColumn: "1 / -1", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.2rem" }}>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 8 }}>Sentence</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 600, color: sentence ? "var(--accent2)" : "var(--text)", transition: "color 0.3s" }}>{sentence || "Waiting for prediction…"}</div>
          </div>
        </div>

        {/* Section: Extracted Frames */}
        {frames.length > 0 && (
          <>
            <div style={sectionLabel}>
              <span>Extracted Frames</span>
              <span style={{ fontSize: "0.62rem", color: "var(--muted)" }}>{frames.length} captured</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <button onClick={() => { setFrames([]); setLastFrame(null); }} style={{ ...btnBase, flex: "none", padding: "4px 12px", fontSize: "0.68rem", color: "var(--danger)", borderColor: "rgba(255,94,122,0.2)", background: "rgba(255,94,122,0.06)" }}>Clear</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              {frames.map((f, i) => (
                <img key={i} src={f} alt={`frame-${i}`} className="frame-thumb" title={`Frame ${frames.length - i}`} />
              ))}
            </div>
          </>
        )}

      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}