import { useState, useRef } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_EXPRESS_URL || "http://localhost:5000";

// Maps spoken words (Bengali/Hindi transliterated) to form values
const WORD_MAP = {
  // Crops
  dhan: "Rice", dhaan: "Rice", rice: "Rice",
  maize: "Maize", bhutta: "Maize", makka: "Maize",
  jute: "Jute", pat: "Jute",
  banana: "Banana", kela: "Banana",
  coconut: "Coconut", narikel: "Coconut",
  // Seasons
  kharif: "Kharif", rabi: "Rabi",
  summer: "Summer", "whole year": "Whole Year", autumn: "Autumn",
  // States
  "west bengal": "West Bengal", pashchimbanga: "West Bengal",
  bihar: "Bihar", odisha: "Odisha", assam: "Assam",
  jharkhand: "Jharkhand",
};

function parseVoiceText(text, setFormData, onTranslate) {
  const lower = text.toLowerCase().trim();
  const parts = lower.split(/[,\s]+/);
  const updates = {};

  for (const part of parts) {
    if (WORD_MAP[part]) {
      const val = WORD_MAP[part];
      // Try to guess field by value type
      const crops = ["Rice", "Maize", "Jute", "Banana", "Coconut"];
      const seasons = ["Kharif", "Rabi", "Summer", "Whole Year", "Autumn"];
      if (crops.includes(val)) updates.crop = val;
      else if (seasons.includes(val)) updates.season = val;
    }
    // Numbers
    const num = parseFloat(part);
    if (!isNaN(num)) {
      // Heuristic: first number likely area
      if (!updates.area) updates.area = num;
    }
  }

  // Multi-word state check
  for (const key of Object.keys(WORD_MAP)) {
    if (lower.includes(key) && !["Rice","Maize","Jute","Banana","Coconut","Kharif","Rabi","Summer","Whole Year","Autumn"].includes(WORD_MAP[key])) {
      updates.state = WORD_MAP[key];
    }
  }

  if (Object.keys(updates).length > 0) {
    setFormData(prev => ({ ...prev, ...updates }));
  }
}

export default function VoiceInput({ setFormData, language = "bn-IN" }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    setError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      setError("Mic error: " + e.error);
      setListening(false);
    };

    recognition.onresult = async (e) => {
      const text = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(" ");
      setTranscript(text);

      if (e.results[0].isFinal) {
        // Try translation if needed
        try {
          const res = await axios.get(`${BASE}/api/translate?text=${encodeURIComponent(text)}`);
          const translated = res.data?.translated || text;
          parseVoiceText(translated, setFormData);
        } catch {
          parseVoiceText(text, setFormData);
        }
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: listening ? "#e05252" : "#001a0d",
          color: "#e8f5ee",
          fontSize: "1.4rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: listening ? "0 0 0 6px rgba(192,57,43,0.2)" : "0 4px 24px rgba(0,0,0,0.55)",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          animation: listening ? "pulse 1.2s infinite" : "none",
        }}
        title={listening ? "Stop listening" : "Start voice input"}
      >
        {listening ? "⏹" : "🎤"}
      </button>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#4d7a5e", textTransform: "uppercase" }}>
          {listening ? "🔴 Listening..." : "Voice Input"}
        </div>
        <div style={{ fontSize: "0.68rem", color: "#4d7a5e" }}>
          {language === "bn-IN" ? "বাংলা / Bengali" : "हिंदी / Hindi"}
        </div>
      </div>

      {transcript && (
        <div style={{
          background: "#e8f5ee",
          border: "1px solid rgba(0,166,81,0.18)",
          borderRadius: 8,
          padding: "0.4rem 0.7rem",
          fontSize: "0.8rem",
          color: "#8bc4a0",
          maxWidth: 200,
          textAlign: "right",
        }}>
          "{transcript}"
        </div>
      )}

      {error && <div style={{ fontSize: "0.78rem", color: "#e05252", textAlign: "right" }}>{error}</div>}

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(192,57,43,0.15); }
          50% { box-shadow: 0 0 0 10px rgba(192,57,43,0.05); }
        }
      `}</style>
    </div>
  );
}
