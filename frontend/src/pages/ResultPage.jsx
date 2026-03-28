import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import RiskBadge from "../components/RiskBadge";
import ShapChart from "../components/ShapChart";
import { saveHistory } from "../api/predict";
import { TrendingUp, IndianRupee, Sprout, BarChart2, Save, ArrowLeft } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function ResultCard({ icon: Icon, title, color, children }) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${color} shadow-lg shrink-0`}>
          <Icon size={15} color="white" strokeWidth={2.2} />
        </div>
        <h3 className="text-white font-black text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-4" />
      {children}
    </div>
  );
}

export default function ResultPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!state?.result) {
    return (
      <div className="min-h-screen bg-[#020805]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-400 text-lg mb-4">No prediction found.</p>
          <button onClick={() => navigate("/predict")}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wide">
            <ArrowLeft size={14} /> Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const { result, inputs } = state;
  const { predicted_yield, lower_bound, upper_bound, confidence, risk_level, income_min, income_max, shap_features, advice, unit } = result;
  const totalHarvest = inputs?.area ? (predicted_yield * inputs.area).toFixed(1) : null;
  const riskColors = { Low: "from-green-500 to-emerald-600", Medium: "from-amber-500 to-orange-600", High: "from-red-600 to-rose-700" };
  const riskGlow   = { Low: "rgba(0,166,81,0.3)", Medium: "rgba(245,158,11,0.3)", High: "rgba(220,38,38,0.3)" };

  const handleSave = async () => {
    setSaving(true); setSaveError("");
    try { await saveHistory(result, inputs); setSaved(true); }
    catch { setSaveError("Save failed. Please try again."); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#020805]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Sprout size={11} className="text-green-400" />
            <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Your Prediction Result</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Yield <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Forecast</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {inputs?.crop} · {inputs?.state} · {inputs?.season} · {inputs?.crop_year}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Main yield card */}
          <div className="lg:col-span-2 relative bg-gradient-to-br from-[#001a0d] to-[#020805] border border-green-500/20 rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{ boxShadow: `0 0 40px ${riskGlow[risk_level] || "rgba(0,166,81,0.15)"}` }}>
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 20px)" }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Predicted Yield</p>
                  <div className="flex items-end gap-2">
                    <span className="text-[3.5rem] font-black text-white leading-none">{predicted_yield}</span>
                    <span className="text-green-400 font-bold text-lg pb-2">{unit || "t/ha"}</span>
                  </div>
                  {totalHarvest && <p className="text-gray-400 text-sm mt-1">Total harvest: <span className="text-green-400 font-bold">{totalHarvest} t</span> for {inputs.area} ha</p>}
                </div>
                <RiskBadge level={risk_level} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-[0.65rem] font-bold uppercase tracking-wider mb-1">Confidence Range</p>
                  <p className="text-white font-bold text-sm">{lower_bound} – {upper_bound} <span className="text-green-400">{unit || "t/ha"}</span></p>
                  <p className="text-gray-500 text-[0.65rem] mt-0.5">{confidence} confidence</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-[0.65rem] font-bold uppercase tracking-wider mb-1">Risk Level</p>
                  <div className="mt-1"><RiskBadge level={risk_level} /></div>
                </div>
              </div>

              {advice && (
                <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-3">
                  <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">💡 Agronomic Advice</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{advice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Income card */}
          <ResultCard icon={IndianRupee} title="Income Forecast" color="from-teal-500 to-green-600">
            <div className="space-y-3">
              <div className="bg-green-500/8 border border-green-500/15 rounded-xl p-4">
                <p className="text-gray-500 text-[0.65rem] font-bold uppercase tracking-wider mb-1">Minimum Income</p>
                <p className="text-2xl font-black text-green-400">{fmt(income_min)}</p>
              </div>
              <div className="bg-green-500/12 border border-green-500/20 rounded-xl p-4">
                <p className="text-gray-500 text-[0.65rem] font-bold uppercase tracking-wider mb-1">Maximum Income</p>
                <p className="text-2xl font-black text-green-300">{fmt(income_max)}</p>
              </div>
              <p className="text-gray-500 text-[0.65rem] text-center">Based on current MSP rates and yield range</p>
            </div>
          </ResultCard>
        </div>

        {/* SHAP Chart */}
        {shap_features && (
          <ResultCard icon={BarChart2} title="SHAP Feature Importance" color="from-green-500 to-emerald-600">
            <ShapChart features={shap_features} />
          </ResultCard>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate("/predict")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm uppercase tracking-wide hover:bg-white/8 hover:border-white/20 transition-all duration-200">
            <ArrowLeft size={14} /> New Prediction
          </button>
          <button onClick={() => navigate("/marketplace")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm uppercase tracking-wide hover:bg-white/8 hover:border-white/20 transition-all duration-200">
            View Marketplace →
          </button>
          <button onClick={handleSave} disabled={saving || saved}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_16px_rgba(0,166,81,0.3)] hover:shadow-[0_0_24px_rgba(0,166,81,0.5)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto">
            <Save size={14} /> {saved ? "Saved ✓" : saving ? "Saving…" : "Save to History"}
          </button>
        </div>
        {saveError && <p className="text-red-400 text-sm mt-2 text-center">{saveError}</p>}
      </main>
      <Footer />
    </div>
  );
}
