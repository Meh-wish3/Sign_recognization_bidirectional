import React, { useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c12; --surface: #0e1520; --surface2: #141c2b;
    --border: rgba(99,179,255,0.12); --accent: #3b9eff; --accent2: #00e5c0;
    --text: #e8f0ff; --muted: #5a6a80; --danger: #ff5e7a; --glow: rgba(59,158,255,0.2);
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Mono', monospace; }

  body::before {
    content: ''; position: fixed; inset: 0;
    background-image: linear-gradient(rgba(59,158,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,158,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: 0;
  }

  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
`;

export default function App() {
  const videoRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [word, setWord] = useState("");
  const [confidence, setConfidence] = useState("");
  const [sentence, setSentence] = useState("");
  const [textInput, setTextInput] = useState("");
  const [images, setImages] = useState([]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setIsRunning(true);
  };

  const stopCamera = () => {
    const tracks = videoRef.current.srcObject?.getTracks() || [];
    tracks.forEach(t => t.stop());
    videoRef.current.srcObject = null;
    setIsRunning(false);
  };

  const predict = async () => {
    if (!isRunning) return;
    const res = await fetch("https://YOUR-RENDER-BACKEND/predict");
    const data = await res.json();
    setWord(data.word);
    setSentence(data.sentence);
  };

  const convertText = async () => {
    const res = await fetch("https://YOUR-RENDER-BACKEND/text-to-sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textInput }),
    });
    const data = await res.json();
    setImages(data.images);
  };

  const cardStyle = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 20, overflow: "hidden", marginBottom: "1.5rem",
    boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
  };

  const btnBase = {
    flex: 1, padding: "0.75rem 1rem", borderRadius: 12,
    border: "1px solid var(--border)", background: "var(--surface2)",
    color: "var(--text)", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
    cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.2s",
  };

  const sectionTitle = {
    fontFamily: "'Syne', sans-serif", fontSize: "0.7rem",
    textTransform: "uppercase", letterSpacing: "0.15em",
    color: "var(--accent)", marginBottom: "1rem",
    display: "flex", alignItems: "center", gap: "0.5rem",
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, var(--accent), var(--accent2))", borderRadius: 14, display: "grid", placeItems: "center", fontSize: "1.5rem", boxShadow: "0 0 24px var(--glow)", flexShrink: 0 }}>🤟</div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, background: "linear-gradient(90deg, var(--text), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SignBridge</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Bidirectional Sign Recognition System</p>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, border: "1px solid var(--border)", color: "var(--muted)" }}>v1.0</div>
        </header>

        {/* Camera */}
        <div style={sectionTitle}>Live Camera Feed</div>
        <div style={cardStyle}>
          <div style={{ position: "relative", background: "#060a0f", aspectRatio: "16/10", overflow: "hidden" }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {!isRunning && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,12,18,0.85)" }}>
                <div style={{ textAlign: "center", color: "var(--muted)" }}>
                  <div style={{ fontSize: "3rem" }}>📷</div>
                  <p style={{ fontSize: "0.85rem", marginTop: 8 }}>Camera is off</p>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "var(--surface2)", borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--muted)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isRunning ? "#22c55e" : "var(--muted)", boxShadow: isRunning ? "0 0 8px #22c55e" : "none", animation: isRunning ? "pulse 1.5s infinite" : "none" }} />
            <span>{isRunning ? "Live" : "Inactive"}</span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", padding: "1.25rem" }}>
            <button style={{ ...btnBase, background: "var(--accent)", borderColor: "var(--accent)", color: "#fff", boxShadow: "0 0 20px var(--glow)" }} onClick={startCamera} disabled={isRunning}>▶ Start</button>
            <button style={{ ...btnBase, background: "rgba(255,94,122,0.1)", borderColor: "rgba(255,94,122,0.3)", color: "var(--danger)" }} onClick={stopCamera} disabled={!isRunning}>■ Stop</button>
            <button style={btnBase} onClick={predict}>⬡ Predict</button>
          </div>
        </div>

        {/* Output */}
        <div style={sectionTitle}>Recognition Output</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {[{ label: "Current Word", value: word || "—" }, { label: "Confidence", value: confidence || "—" }].map(({ label, value }) => (
            <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.25rem" }}>
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: value !== "—" ? "var(--accent2)" : "var(--text)" }}>{value}</div>
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.25rem" }}>
            <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 8 }}>Sentence</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: sentence ? "var(--accent2)" : "var(--text)" }}>{sentence || "Waiting for prediction..."}</div>
          </div>
        </div>

        {/* Text to Sign */}
        <div style={sectionTitle}>English → Sign</div>
        <div style={{ ...cardStyle, padding: "1.5rem", overflow: "visible" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Enter a sentence to convert it into sign language gesture images.</p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <input value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="e.g. Hello, how are you?"
              style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem", color: "var(--text)", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none" }} />
            <button style={{ ...btnBase, flex: "none", padding: "0.75rem 1.25rem", background: "var(--accent)", borderColor: "var(--accent)", color: "#fff", boxShadow: "0 0 20px var(--glow)" }} onClick={convertText}>Convert →</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
            {images.length === 0
              ? <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>No gestures yet — enter a sentence above.</p>
              : images.map((img, i) => (
                <div key={i} style={{ width: 90, height: 90, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "grid", placeItems: "center" }}>
                  <img src={img} alt="gesture" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
          </div>
        </div>

      </div>
    </>
  );
}