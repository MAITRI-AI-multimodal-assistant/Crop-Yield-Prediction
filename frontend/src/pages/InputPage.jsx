import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VoiceInput from "../components/VoiceInput";
import StripScanner from "../components/StripScanner";
import { predictYield, fetchClimate } from "../api/predict";
import { Leaf, Satellite, Mic, ScanLine, ChevronDown } from "lucide-react";

const INITIAL = {
  crop: "", season: "", state: "", crop_year: new Date().getFullYear(),
  area: "", annual_rainfall: "", temperature: "", humidity: "",
  N: "", P: "", K: "", ph: "", fertilizer: "", pesticide: "", ndvi: "",
};
const CROPS   = ["Rice","Maize","Jute","Banana","Coconut"];
const SEASONS = ["Kharif","Rabi","Whole Year","Summer","Autumn"];
const STATES  = ["West Bengal","Bihar","Odisha","Assam","Jharkhand","Uttar Pradesh","Maharashtra","Karnataka","Andhra Pradesh","Tamil Nadu","Madhya Pradesh","Rajasthan","Punjab","Haryana","Gujarat"];

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 focus:shadow-[0_0_0_3px_rgba(0,166,81,0.12)] transition-all";
const autoClass  = "w-full px-4 py-2.5 rounded-xl bg-green-500/8 border border-green-500/30 text-green-300 text-sm focus:outline-none focus:border-green-500/60 focus:shadow-[0_0_0_3px_rgba(0,166,81,0.15)] transition-all";
const labelClass = "block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5";

function SectionCard({ icon: Icon, title, color, children }) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${color} shadow-lg shrink-0`}>
          <Icon size={15} color="white" strokeWidth={2.2} />
        </div>
        <h3 className="text-white font-black text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-5" />
      {children}
    </div>
  );
}

function FormInput({ label, name, value, onChange, type="text", placeholder, autoFilled, required, children }) {
  return (
    <div>
      <label className={labelClass}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <div className="relative">
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
          className={autoFilled ? autoClass : inputClass} />
        {autoFilled && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.6rem] font-bold text-green-500 uppercase tracking-wider">Auto</span>}
        {children}
      </div>
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className={labelClass}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <div className="relative">
        <select name={name} value={value} onChange={onChange} required={required}
          className={`${inputClass} appearance-none pr-9`}>
          <option value="" style={{ background:"#0d1810" }}>Select…</option>
          {options.map(o => <option key={o} value={o} style={{ background:"#0d1810" }}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function InputPage() {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState(INITIAL);
  const [autoFilled, setAutoFilled] = useState({ annual_rainfall: false, temperature: false, humidity: false });
  const [loading, setLoading]       = useState(false);
  const [climateLoading, setClimateLoading] = useState(false);
  const [error, setError]           = useState("");
  const [voiceLang, setVoiceLang]   = useState("bn-IN");
  const [showVoice, setShowVoice]   = useState(false);
  const [showScan, setShowScan]     = useState(false);

  useEffect(() => {
    if (formData.season && formData.annual_rainfall) {
      const rain = parseFloat(formData.annual_rainfall);
      const base = formData.season === "Kharif" ? 0.7 : formData.season === "Rabi" ? 0.55 : 0.6;
      const ndvi = Math.min(0.95, Math.max(0.2, base + (rain - 1000) / 5000)).toFixed(2);
      setFormData(p => ({ ...p, ndvi }));
    }
  }, [formData.season, formData.annual_rainfall]);

  useEffect(() => {
    if (!formData.state) return;
    let cancelled = false;
    (async () => {
      setClimateLoading(true);
      try {
        const { data } = await fetchClimate(formData.state);
        if (!cancelled) {
          setFormData(p => ({ ...p, annual_rainfall: data.rainfall ?? p.annual_rainfall, temperature: data.temperature ?? p.temperature, humidity: data.humidity ?? p.humidity }));
          setAutoFilled({ annual_rainfall: true, temperature: true, humidity: true });
        }
      } catch { /* silent */ } finally { if (!cancelled) setClimateLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [formData.state]);

  const handle = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleVoiceFill = (parsed) => {
    setFormData(p => ({ ...p, ...Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== undefined && v !== "")) }));
    setShowVoice(false);
  };

  const handleScanFill = (soilData) => {
    setFormData(p => ({ ...p, N: soilData.N ?? p.N, P: soilData.P ?? p.P, K: soilData.K ?? p.K, ph: soilData.ph ?? p.ph }));
    setShowScan(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await predictYield(formData);
      navigate("/result", { state: { result, inputs: formData } });
    } catch (err) {
      setError(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020805]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Leaf size={11} className="text-green-400" />
            <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">ML Yield Prediction</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Crop Yield</span></h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Fill in your crop and soil details — climate data is auto-fetched from NASA.</p>
        </div>

        {/* AI tools bar */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button onClick={() => setShowVoice(p => !p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold tracking-wide uppercase transition-all duration-200 ${showVoice ? "bg-green-500/15 border-green-500/40 text-green-400" : "bg-white/3 border-white/10 text-gray-400 hover:border-green-500/30 hover:text-green-400"}`}>
            <Mic size={14} /> Voice Input
            <select value={voiceLang} onChange={e => setVoiceLang(e.target.value)} onClick={e => e.stopPropagation()}
              className="bg-transparent text-xs text-gray-500 border-none outline-none ml-1">
              <option value="bn-IN">বাংলা</option>
              <option value="hi-IN">हिंदी</option>
              <option value="en-IN">English</option>
            </select>
          </button>
          <button onClick={() => setShowScan(p => !p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold tracking-wide uppercase transition-all duration-200 ${showScan ? "bg-green-500/15 border-green-500/40 text-green-400" : "bg-white/3 border-white/10 text-gray-400 hover:border-green-500/30 hover:text-green-400"}`}>
            <ScanLine size={14} /> Scan Soil Strip
          </button>
          {climateLoading && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">
              <Satellite size={14} className="animate-pulse" /> Fetching NASA data…
            </div>
          )}
        </div>

        {showVoice && <div className="mb-6"><VoiceInput lang={voiceLang} onFill={handleVoiceFill} onClose={() => setShowVoice(false)} /></div>}
        {showScan  && <div className="mb-6"><StripScanner onFill={handleScanFill} onClose={() => setShowScan(false)} /></div>}

        {error && <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Crop details */}
          <SectionCard icon={Leaf} title="Crop Details" color="from-green-500 to-emerald-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <FormSelect label="Crop" name="crop" value={formData.crop} onChange={handle} options={CROPS} required />
              <FormSelect label="Season" name="season" value={formData.season} onChange={handle} options={SEASONS} required />
              <FormSelect label="State" name="state" value={formData.state} onChange={handle} options={STATES} required />
              <FormInput label="Crop Year" name="crop_year" type="number" value={formData.crop_year} onChange={handle} placeholder="2024" required />
            </div>
            <div className="mt-4">
              <FormInput label="Land Area (hectares)" name="area" type="number" value={formData.area} onChange={handle} placeholder="e.g. 2.5" required />
            </div>
          </SectionCard>

          {/* Climate */}
          <SectionCard icon={Satellite} title="Climate Data (Auto-filled by NASA)" color="from-teal-500 to-green-600">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput label="Annual Rainfall (mm)" name="annual_rainfall" type="number" value={formData.annual_rainfall} onChange={handle} placeholder="e.g. 1400" autoFilled={autoFilled.annual_rainfall} required />
              <FormInput label="Temperature (°C)" name="temperature" type="number" value={formData.temperature} onChange={handle} placeholder="e.g. 28" autoFilled={autoFilled.temperature} required />
              <FormInput label="Humidity (%)" name="humidity" type="number" value={formData.humidity} onChange={handle} placeholder="e.g. 75" autoFilled={autoFilled.humidity} required />
            </div>
          </SectionCard>

          {/* Soil */}
          <SectionCard icon={ScanLine} title="Soil Parameters" color="from-emerald-600 to-green-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <FormInput label="Nitrogen (N)" name="N" type="number" value={formData.N} onChange={handle} placeholder="kg/ha" required />
              <FormInput label="Phosphorus (P)" name="P" type="number" value={formData.P} onChange={handle} placeholder="kg/ha" required />
              <FormInput label="Potassium (K)" name="K" type="number" value={formData.K} onChange={handle} placeholder="kg/ha" required />
              <FormInput label="pH" name="ph" type="number" value={formData.ph} onChange={handle} placeholder="6.0–7.5" required />
            </div>
          </SectionCard>

          {/* Inputs */}
          <SectionCard icon={Leaf} title="Farm Inputs" color="from-green-400 to-teal-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput label="Fertilizer Used (kg/ha)" name="fertilizer" type="number" value={formData.fertilizer} onChange={handle} placeholder="e.g. 120" required />
              <FormInput label="Pesticide Used (kg/ha)" name="pesticide" type="number" value={formData.pesticide} onChange={handle} placeholder="e.g. 2.5" required />
              <FormInput label="NDVI (auto)" name="ndvi" type="number" value={formData.ndvi} onChange={handle} placeholder="0.2–0.95" autoFilled={!!(formData.season && formData.annual_rainfall)} />
            </div>
          </SectionCard>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.12em] uppercase text-base shadow-[0_0_20px_rgba(0,166,81,0.35)] hover:shadow-[0_0_32px_rgba(0,166,81,0.55)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {loading ? "Running Prediction…" : "🌾 Predict My Yield →"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
