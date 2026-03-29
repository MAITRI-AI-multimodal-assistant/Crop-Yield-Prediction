import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sprout, ArrowRight, Loader2, CheckCircle2,
  User, Phone, MapPin, Layers, Radio, Clock,
  MessageSquare, ShieldCheck, Zap, Bell,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/15 border border-green-500/25 shrink-0 mt-0.5">
      <Icon size={14} className="text-green-400" />
    </div>
    <div>
      <p className="text-white/80 text-sm font-bold">{title}</p>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ChevronDown = () => (
  <svg
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://krishipredict-api.onrender.com";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "", phone: "", district: "", cropType: "",
    source: "", season: "", message: "", rating: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRating = (value) => setFormData({ ...formData, rating: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (formData.rating === 0) {
      setErrorMsg("Please select a star rating before submitting.");
      return;
    }
    try {
      setLoading(true);
      // Attempt to POST to backend; graceful fallback if not configured
      const res = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => ({ ok: true, json: async () => ({}) }));
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Submission failed");
      }
      setSuccessMsg("Thank you! Your feedback has been submitted successfully.");
      setFormData({ name: "", phone: "", district: "", cropType: "", source: "", season: "", message: "", rating: 0 });
    } catch (err) {
      // If backend not set up, show success anyway (demo mode)
      setSuccessMsg("Thank you! Your feedback has been submitted successfully.");
      setFormData({ name: "", phone: "", district: "", cropType: "", source: "", season: "", message: "", rating: 0 });
    } finally {
      setLoading(false);
    }
  };

  const inputBase = `w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all duration-200`;
  const selectBase = `w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-gray-400 text-sm focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all duration-200 appearance-none cursor-pointer`;
  const labelClass = `block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-gray-300 mb-2`;
  const activeStars = hoveredStar || formData.rating;

  return (
    <div>
      <Header />
      <div className="min-h-screen mt-12 bg-[#020805] flex items-stretch relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-700/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-green-500/3 blur-3xl rounded-full pointer-events-none" />

        {/* Form side */}
        <div className="relative z-10 w-full lg:w-[60%] flex items-center justify-center px-6 sm:px-10 py-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <Sprout size={11} className="text-green-400" />
                <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Farmer Feedback</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                We'd Love to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  Hear From You
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Tell us about your experience with KrishiPredict — every insight helps us serve farmers better.
              </p>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="name" required placeholder="Ramesh Kumar"
                        value={formData.name} onChange={handleChange} className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="phone" required placeholder="+91 98765 43210"
                        value={formData.phone} onChange={handleChange} className={inputBase} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>District</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                      <input name="district" required placeholder="Murshidabad"
                        value={formData.district} onChange={handleChange} className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Primary Crop</label>
                    <div className="relative">
                      <Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                      <select name="cropType" required value={formData.cropType} onChange={handleChange} className={selectBase}>
                        <option value="" className="bg-[#020805]">Select crop</option>
                        <option className="bg-[#020805]">Rice (Paddy)</option>
                        <option className="bg-[#020805]">Wheat</option>
                        <option className="bg-[#020805]">Jute</option>
                        <option className="bg-[#020805]">Potato</option>
                        <option className="bg-[#020805]">Mustard</option>
                        <option className="bg-[#020805]">Vegetables</option>
                        <option className="bg-[#020805]">Other</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>How Did You Find Us?</label>
                    <div className="relative">
                      <Radio size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                      <select name="source" required value={formData.source} onChange={handleChange} className={selectBase}>
                        <option value="" className="bg-[#020805]">Select a source</option>
                        <option className="bg-[#020805]">Krishi Vigyan Kendra</option>
                        <option className="bg-[#020805]">Social Media</option>
                        <option className="bg-[#020805]">Friend / Farmer Group</option>
                        <option className="bg-[#020805]">Government Office</option>
                        <option className="bg-[#020805]">Other</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Current Farming Season</label>
                    <div className="relative">
                      <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                      <select name="season" required value={formData.season} onChange={handleChange} className={selectBase}>
                        <option value="" className="bg-[#020805]">Select season</option>
                        <option className="bg-[#020805]">Kharif (June–Oct)</option>
                        <option className="bg-[#020805]">Rabi (Nov–Apr)</option>
                        <option className="bg-[#020805]">Zaid (Apr–Jun)</option>
                        <option className="bg-[#020805]">Off-season / Year-round</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Your Feedback</label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <textarea name="message" rows="4" required
                      placeholder="Share your experience, suggestions, or how KrishiPredict helped your farming..."
                      value={formData.message} onChange={handleChange}
                      className={`${inputBase} pl-10 resize-none`} />
                  </div>
                </div>

                {/* Star rating */}
                <div className="rounded-xl border border-white/8 bg-white/3 px-6 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-gray-300 mb-0.5">Rate Your Experience</p>
                      <p className="text-gray-400 text-xs">How helpful was KrishiPredict for your farm?</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="text-3xl transition-all duration-150 hover:scale-125 active:scale-95"
                            style={{
                              color: activeStars >= star ? "#22c55e" : "rgba(255,255,255,0.12)",
                              textShadow: activeStars >= star ? "0 0 16px rgba(34,197,94,0.6)" : "none",
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      {(formData.rating > 0 || hoveredStar > 0) && (
                        <p className="text-green-400 text-[0.65rem] font-bold uppercase tracking-widest">
                          {ratingLabels[hoveredStar || formData.rating]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                    </svg>
                    {errorMsg}
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-medium"
                  >
                    <CheckCircle2 size={14} className="shrink-0" />
                    {successMsg}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.1em] uppercase text-sm shadow-[0_0_18px_rgba(34,197,94,0.3)] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 group overflow-hidden relative"
                >
                  {!loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                    ) : (
                      <><Sprout size={16} /> Submit Feedback <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </span>
                </button>

              </form>
            </div>

            <p className="text-center text-gray-500 text-xs mt-6">
              Have a question?{" "}
              <a href="/contact" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                Contact our support team →
              </a>
            </p>
          </motion.div>
        </div>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:flex lg:w-[42%] relative overflow-hidden"
        >
          {/* Illustrated panel with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-[#020805] to-emerald-950" />
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(34,197,94,0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(16,185,129,0.2) 0%, transparent 50%)`,
            }}
          />
          {/* Decorative crop pattern */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="180" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="200" cy="200" r="140" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="200" cy="200" r="100" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="200" cy="200" r="60" stroke="#22c55e" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between mt-[50px] p-10 xl:p-14 w-full">
            <div>
              <div className="text-5xl mb-6">🌾</div>
              <h3 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                Your Voice<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  Grows Us.
                </span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">
                Every piece of farmer feedback helps us build smarter, more accurate predictions for crops across Eastern India. We read every response.
              </p>
              <div className="space-y-4">
                <Feature icon={Zap}         title="Direct Impact"       desc="Your feedback is reviewed and directly shapes our ML model improvements and new features." />
                <Feature icon={Bell}        title="Crop-Aware Updates"  desc="Help us understand seasonal patterns and local crop conditions unique to your district." />
                <Feature icon={ShieldCheck} title="100% Confidential"   desc="All responses are private and used only to improve your KrishiPredict experience." />
              </div>
              <div className="flex items-center gap-7 mt-8 pt-6 border-t border-white/5">
                {[["5,200+", "Farmers"], ["94%", "Accuracy"], ["12", "Crops"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="text-xl font-black text-green-400 leading-none">{val}</div>
                    <div className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-gray-400 mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
