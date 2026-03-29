import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getBotResponse, detectLanguage, analyseFile } from "./chatbot-brain";
import { getUser } from "../api/auth";

/* ── Typing indicator ──────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#00a651",
          animation: `dot-bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

/* ── Markdown-lite renderer ────────────────────────────────────── */
function MsgText({ text }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>")
    .replace(/•/g, "•&nbsp;");
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ── Single message bubble ─────────────────────────────────────── */
function Bubble({ msg, onSpeak }) {
  const isBot = msg.role === "bot";
  return (
    <div style={{
      display: "flex",
      flexDirection: isBot ? "row" : "row-reverse",
      gap: "0.5rem",
      alignItems: "flex-end",
      marginBottom: "0.75rem",
      animation: "msg-in 0.25s ease",
    }}>
      {/* Avatar */}
      {isBot && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #001a0d, #00a651)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.85rem", flexShrink: 0,
        }}>🌾</div>
      )}

      <div style={{ maxWidth: "80%" }}>
        {/* File attachment preview */}
        {msg.file && (
          <div style={{
            marginBottom: 4, padding: "6px 10px",
            background: "rgba(0,166,81,0.12)", borderRadius: 8,
            border: "1px solid rgba(0,166,81,0.25)",
            fontSize: "0.75rem", color: "#001a0d",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            📎 {msg.file.name} ({(msg.file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        {/* Voice note preview */}
        {msg.audioUrl && (
          <audio controls src={msg.audioUrl} style={{ width: "100%", marginBottom: 4, borderRadius: 8, height: 32 }} />
        )}

        {/* Text bubble */}
        {msg.text && (
          <div style={{
            padding: "0.6rem 0.9rem",
            background: isBot
              ? "#0d2c1b"
              : "linear-gradient(135deg, #001a0d 0%, #001a0d 100%)",
            color: isBot ? "#d4edda" : "#fff",
            borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
            fontSize: "0.875rem",
            lineHeight: 1.65,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            border: isBot ? "1px solid rgba(0,166,81,0.18)" : "none",
          }}>
            <MsgText text={msg.text} />

            {/* Nav suggestion button */}
            {msg.navPath && (
              <div style={{ marginTop: "0.6rem" }}>
                <button
                  onClick={msg.onNav}
                  style={{
                    color: isBot ? "#001a0d" : "#fff",
                    padding: "4px 12px", borderRadius: 100, fontSize: "0.75rem",
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    background: isBot ? "#0d1810" : "rgba(255,255,255,0.2)",
                    border: isBot ? "1px solid rgba(0,166,81,0.18)" : "1px solid rgba(255,255,255,0.4)",
                  }}>
                  → Go there now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Timestamp + TTS */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2, justifyContent: isBot ? "flex-start" : "flex-end" }}>
          <span style={{ fontSize: "0.65rem", color: "#4d7a5e" }}>
            {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isBot && msg.text && (
            <button onClick={() => onSpeak(msg.text)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", color: "#4d7a5e", padding: 0 }}
              title="Read aloud">🔊</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Language selector ─────────────────────────────────────────── */
const LANGS = [{ id: "en", label: "EN", full: "English" }, { id: "bn", label: "বাং", full: "Bengali" }, { id: "hi", label: "हि", full: "Hindi" }];

/* ── Main Chatbot component ────────────────────────────────────── */
export default function Chatbot() {
  const navigate = useNavigate();
  const user     = getUser();

  const [open,        setOpen]        = useState(false);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [lang,        setLang]        = useState("en");
  const [typing,      setTyping]      = useState(false);
  const [recording,   setRecording]   = useState(false);
  const [unread,      setUnread]      = useState(0);
  const [dragOver,    setDragOver]    = useState(false);
  const [speaking,    setSpeaking]    = useState(false);

  const bottomRef    = useRef(null);
  const fileRef      = useRef(null);
  const inputRef     = useRef(null);
  const mediaRef     = useRef(null);
  const chunksRef    = useRef([]);

  /* ── Initial greeting ─────────────────────────────────────────── */
  useEffect(() => {
    const greeting = {
      en: `👋 Hi${user?.name ? " " + user.name.split(" ")[0] : ""}! I'm **Krishi**, your farming assistant. Ask me about crops, schemes, soil health, or say "go to marketplace".\n\nI understand **English**, **বাংলা** and **हिंदी**! 🌾`,
      bn: `👋 নমস্কার${user?.name ? " " + user.name.split(" ")[0] : ""}! আমি **কৃষি**, আপনার কৃষি সহায়ক। ফসল, প্রকল্প, মাটি সম্পর্কে জিজ্ঞেস করুন।\n\n**English**, **বাংলা** ও **हिंदी** বুঝি! 🌾`,
      hi: `👋 नमस्ते${user?.name ? " " + user.name.split(" ")[0] : ""}! मैं **कृषि** हूं, आपका कृषि सहायक। फसल, योजनाएं, मिट्टी के बारे में पूछें।\n\n**English**, **বাংলা** और **हिंदी** समझता हूं! 🌾`,
    };
    pushBot(greeting[lang] || greeting.en);
  }, []);

  /* ── Helpers ──────────────────────────────────────────────────── */
  const pushBot = useCallback((text, extras = {}) => {
    setMessages(p => [...p, { id: Date.now() + Math.random(), role: "bot", text, ts: Date.now(), ...extras }]);
  }, []);

  const pushUser = useCallback((text, extras = {}) => {
    setMessages(p => [...p, { id: Date.now() + Math.random(), role: "user", text, ts: Date.now(), ...extras }]);
  }, []);

  /* Auto-scroll */
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  /* Unread badge when closed */
  useEffect(() => {
    if (!open && messages.length > 1) setUnread(p => p + 1);
  }, [messages]);
  useEffect(() => { if (open) setUnread(0); }, [open]);

  /* ── Send message ─────────────────────────────────────────────── */
  const sendMessage = useCallback((text, extras = {}) => {
    const trimmed = text.trim();
    if (!trimmed && !extras.file && !extras.audioUrl) return;

    const detectedLang = extras.audioUrl ? lang : detectLanguage(trimmed) !== "en" ? detectLanguage(trimmed) : lang;
    if (detectedLang !== lang) setLang(detectedLang);

    pushUser(trimmed || (extras.file ? "📎 File sent" : "🎤 Voice message"), extras);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      let response;
      if (extras.file) {
        response = { text: analyseFile(extras.file, detectedLang), navigate: null };
      } else {
        response = getBotResponse(trimmed, detectedLang, user);
      }
      if (!response) return;

      const navFn = response.navigate ? () => navigate(response.navigate) : null;
      pushBot(response.text, { navPath: response.navigate, onNav: navFn });

      /* Auto-navigate after 1.5 s if nav intent */
      if (response.navigate) {
        setTimeout(() => navigate(response.navigate), 1500);
      }
    }, 600 + Math.random() * 400);
  }, [lang, pushUser, pushBot, navigate, user]);

  /* ── File upload ──────────────────────────────────────────────── */
  const handleFile = (file) => {
    if (!file) return;
    sendMessage("", { file });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  /* ── Voice recording ──────────────────────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current  = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url  = URL.createObjectURL(blob);
        stream.getTracks().forEach(t => t.stop());
        // Also try speech-to-text
        runSpeechToText(url);
      };
      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access denied. Please allow microphone in your browser settings.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const runSpeechToText = (audioUrl) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // No STT — just send the audio blob
      sendMessage("", { audioUrl });
      return;
    }
    const recognition = new SpeechRecognition();
    const langMap = { en: "en-IN", bn: "bn-IN", hi: "hi-IN" };
    recognition.lang = langMap[lang] || "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript, { audioUrl });
    };
    recognition.onerror = () => sendMessage("", { audioUrl });
    recognition.start();
  };

  /* ── Text-to-speech ───────────────────────────────────────────── */
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip markdown
    const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/\n/g, " ");
    const utterance = new SpeechSynthesisUtterance(clean);
    const voiceLang = { en: "en-IN", bn: "bn-IN", hi: "hi-IN" }[lang] || "en-IN";
    utterance.lang = voiceLang;
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  /* ── Quick suggestions ────────────────────────────────────────── */
  const suggestions = {
    en: ["🌾 Rice farming tips", "🏛️ PM-KISAN scheme", "🛒 Go to marketplace", "🧪 Soil health guide", "📊 Predict my yield"],
    bn: ["🌾 ধান চাষের টিপস", "🏛️ PM-KISAN প্রকল্প", "🛒 মার্কেটপ্লেসে যাও", "🧪 মাটির স্বাস্থ্য", "📊 ফলন পূর্বাভাস"],
    hi: ["🌾 धान की खेती", "🏛️ PM-KISAN योजना", "🛒 बाज़ार जाएं", "🧪 मिट्टी स्वास्थ्य", "📊 पैदावार पूर्वानुमान"],
  }[lang];

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <>
      {/* ── CSS injected ── */}
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chat-open {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fab-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,166,81,0.4); }
          50%       { box-shadow: 0 4px 32px rgba(0,166,81,0.55); }
        }
        .krishi-chat-input:focus { outline: none; border-color: #00a651; box-shadow: 0 0 0 3px rgba(0,166,81,0.15); }
        .krishi-icon-btn { background: none; border: none; cursor: pointer; border-radius: 8px; padding: 6px; transition: background 0.15s; display:flex; align-items:center; justify-content:center; }
        .krishi-icon-btn:hover { background: #0d1810; }
        .krishi-send-btn { background: #001a0d; color: #fff; border: none; border-radius: 10px; padding: 8px 16px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; transition: background 0.2s; display:flex; align-items:center; gap:5px; }
        .krishi-send-btn:hover { background: #001a0d; }
        .krishi-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* ── FAB button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9998,
          width: 58, height: 58, borderRadius: "50%",
          background: "linear-gradient(135deg, #001a0d 0%, #001a0d 100%)",
          border: "none", cursor: "pointer", color: "#fff",
          fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,166,81,0.4)",
          animation: !open ? "fab-pulse 2.5s infinite" : "none",
          transition: "transform 0.2s",
          transform: open ? "scale(0.92)" : "scale(1)",
        }}
        title="Chat with Krishi">
        {open ? "✕" : "🌾"}
        {unread > 0 && !open && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            background: "#e74c3c", color: "#fff",
            borderRadius: "50%", width: 20, height: 20,
            fontSize: "0.65rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{unread}</span>
        )}
      </button>

      {/* ── Chat window ─────────────────────────────────────────── */}
      {open && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            position: "fixed", bottom: 92, right: 24, zIndex: 9999,
            width: 380, height: 580,
            background: "#070d09",
            borderRadius: 20,
            boxShadow: "0 16px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
            display: "flex", flexDirection: "column",
            animation: "chat-open 0.25s ease",
            border: dragOver ? "2px dashed #00a651" : "1px solid rgba(0,166,81,0.18)",
            overflow: "hidden",
          }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #001a0d 0%, #001a0d 100%)",
            padding: "0.85rem 1rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", border: "1.5px solid rgba(255,255,255,0.2)",
              }}>🌾</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Playfair Display', serif" }}>Krishi Assistant</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.68rem", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00cc63", display: "inline-block" }} />
                  Online · Crops · Schemes · Navigation
                </div>
              </div>
            </div>

            {/* Language selector */}
            <div style={{ display: "flex", gap: 3 }}>
              {LANGS.map(l => (
                <button key={l.id} onClick={() => setLang(l.id)}
                  title={l.full}
                  style={{
                    padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 700,
                    background: lang === l.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                    color: lang === l.id ? "#001a0d" : "rgba(255,255,255,0.7)",
                    transition: "all 0.15s",
                  }}>{l.label}</button>
              ))}
              {speaking && (
                <button onClick={stopSpeaking}
                  style={{ padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: "#e74c3c", color: "#fff", fontSize: "0.72rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "0.85rem",
            display: "flex", flexDirection: "column",
            background: dragOver ? "rgba(0,166,81,0.04)" : "transparent",
          }}>
            {dragOver && (
              <div style={{
                position: "absolute", inset: 60, border: "2px dashed #00a651",
                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,166,81,0.06)", zIndex: 1, pointerEvents: "none",
              }}>
                <div style={{ textAlign: "center", color: "#00a651", fontWeight: 700 }}>
                  📂<br />Drop file here
                </div>
              </div>
            )}

            {messages.map(msg => (
              <Bubble key={msg.id} msg={msg} onSpeak={speak} />
            ))}

            {typing && (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #001a0d, #00a651)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>🌾</div>
                <div style={{ background: "#e8f5ee", borderRadius: "4px 16px 16px 16px", border: "1px solid rgba(0,166,81,0.18)" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick suggestion chips */}
          {messages.length <= 2 && (
            <div style={{ padding: "0 0.85rem 0.5rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ""))}
                  style={{
                    padding: "4px 10px", borderRadius: 100,
                    border: "1px solid rgba(0,166,81,0.18)", background: "#e8f5ee",
                    fontSize: "0.72rem", cursor: "pointer", color: "#8bc4a0",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.target.style.background = "#0d1810"; e.target.style.borderColor = "#00a651"; }}
                  onMouseLeave={e => { e.target.style.background = "#e8f5ee"; e.target.style.borderColor = "rgba(0,166,81,0.18)"; }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Recording indicator */}
          {recording && (
            <div style={{
              margin: "0 0.85rem 0.4rem",
              padding: "0.5rem 0.75rem",
              background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)",
              borderRadius: 10, display: "flex", alignItems: "center", gap: "0.5rem",
              fontSize: "0.8rem", color: "#e74c3c", fontWeight: 600,
            }}>
              <span style={{ animation: "dot-bounce 0.8s infinite" }}>●</span>
              Recording in {LANGS.find(l => l.id === lang)?.full}… tap mic to stop
            </div>
          )}

          {/* Input bar */}
          <div style={{
            padding: "0.65rem 0.85rem",
            borderTop: "1px solid rgba(0,166,81,0.18)",
            background: "#e8f5ee",
            display: "flex", gap: "0.4rem", alignItems: "flex-end",
            flexShrink: 0,
          }}>
            {/* File upload */}
            <input type="file" ref={fileRef} style={{ display: "none" }}
              accept="image/*,.pdf,.csv,.xlsx,.docx,.txt,.json"
              onChange={e => handleFile(e.target.files[0])} />
            <button className="krishi-icon-btn" onClick={() => fileRef.current?.click()} title="Attach file">
              <span style={{ fontSize: "1.1rem" }}>📎</span>
            </button>

            {/* Voice mic */}
            <button
              className="krishi-icon-btn"
              onClick={recording ? stopRecording : startRecording}
              title={recording ? "Stop recording" : "Voice message"}
              style={{ background: recording ? "rgba(231,76,60,0.1)" : "transparent" }}>
              <span style={{ fontSize: "1.1rem" }}>{recording ? "⏹" : "🎤"}</span>
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              className="krishi-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
              placeholder={{
                en: "Ask in English, বাংলা or हिंदी…",
                bn: "বাংলায়, ইংরেজিতে বা হিন্দিতে জিজ্ঞেস করুন…",
                hi: "हिंदी, English या বাংলা में पूछें…",
              }[lang]}
              rows={1}
              style={{
                flex: 1,
                padding: "0.55rem 0.75rem",
                border: "1.5px solid rgba(0,166,81,0.18)",
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#d4edda",
                background: "#070d09",
                resize: "none",
                maxHeight: 80,
                overflowY: "auto",
                lineHeight: 1.5,
              }}
            />

            {/* Send */}
            <button className="krishi-send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() && !recording}>
              ↑
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: "0.3rem 0.85rem",
            textAlign: "center", fontSize: "0.62rem",
            color: "#4d7a5e", background: "#e8f5ee",
            borderTop: "1px solid #0d1810",
          }}>
            🌾 Krishi AI · Understands English · বাংলা · हिंदी · Drag & drop files
          </div>
        </div>
      )}
    </>
  );
}
