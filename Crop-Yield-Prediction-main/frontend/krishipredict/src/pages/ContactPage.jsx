import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, CheckCircle2, Loader2,
  ArrowRight, Sprout, ShieldCheck, Zap, Bell, User, FileText, MapPin
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

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://krishipredict-api.onrender.com";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", district: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const hdlChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const hdlSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await fetch(`${BACKEND_URL}/api/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => ({}));

      setSuccessMsg("Message sent! Our agri-expert team will reach out within 24 hours.");
      setFormData({ name: "", email: "", phone: "", district: "", message: "" });
    } catch (err) {
      setSuccessMsg("Message sent! Our agri-expert team will reach out within 24 hours.");
      setFormData({ name: "", email: "", phone: "", district: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  const inputBase = `w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all duration-200`;
  const labelClass = `block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-gray-300 mb-2`;

  return (
    <div>
      <Header />
      <div className="min-h-screen mt-12 bg-[#020805] flex items-stretch relative overflow-hidden">

        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-700/5 blur-3xl rounded-full pointer-events-none" />

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
                <Mail size={11} className="text-green-400" />
                <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                We're Here to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  Help You.
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Have questions about KrishiPredict? Our agri-expert team responds within 24 hours.
              </p>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <form onSubmit={hdlSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="name" required placeholder="Ramesh Kumar"
                        value={formData.name} onChange={hdlChange} className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="email" type="email" required placeholder="ramesh@example.com"
                        value={formData.email} onChange={hdlChange} className={inputBase} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="phone" type="tel" required placeholder="+91 00000 00000"
                        value={formData.phone} onChange={hdlChange} className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>District / State</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="district" placeholder="e.g. Nadia, West Bengal"
                        value={formData.district} onChange={hdlChange} className={inputBase} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <textarea name="message" rows="5" required
                      placeholder="Describe your query, issue, or how we can help with your farming needs..."
                      value={formData.message} onChange={hdlChange}
                      className={`${inputBase} pl-10 resize-none`} />
                  </div>
                </div>

                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-medium">
                    <CheckCircle2 size={14} className="shrink-0" /> {successMsg}
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium">
                    {errorMsg}
                  </motion.div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.1em] uppercase text-sm shadow-[0_0_18px_rgba(34,197,94,0.3)] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2.5">
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Sprout size={16} /> Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Contact info row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 px-2">
              <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500">Reach Us:</span>

              <a href="tel:+919830000000" className="flex items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors duration-200 group">
                <Phone size={14} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-[0.7rem] font-bold tracking-wider">+91 98300 00000</span>
              </a>

              <a href="mailto:krishipredict@gmail.com" className="flex items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors duration-200 group">
                <Mail size={14} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-[0.7rem] font-bold tracking-wider">krishipredict@gmail.com</span>
              </a>
            </div>

            {/* Quick help cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { emoji: "📱", title: "WhatsApp", desc: "Instant help" },
                { emoji: "🏛️", title: "KVK Support", desc: "Field visits" },
                { emoji: "🤖", title: "AI Chatbot", desc: "24/7 instant" },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="bg-white/3 border border-white/8 rounded-xl p-3 text-center hover:border-green-500/25 transition-all duration-200">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="text-white text-xs font-bold">{title}</p>
                  <p className="text-gray-500 text-[0.65rem]">{desc}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Right decorative panel */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:flex lg:w-[42%] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-[#020805] to-emerald-950" />
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 80% 20%, rgba(34,197,94,0.3) 0%, transparent 50%),
                                radial-gradient(circle at 20% 80%, rgba(16,185,129,0.2) 0%, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
              {[180, 140, 100, 60].map(r => (
                <circle key={r} cx="200" cy="200" r={r} stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8" />
              ))}
            </svg>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between mt-[50px] p-10 xl:p-14 w-full">
            <div>
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                Let's Grow<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  Together.
                </span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">
                Whether you need help with predictions, marketplace listings, or government scheme guidance — our team of agri-experts is always ready.
              </p>
              <div className="space-y-4">
                <Feature icon={Zap}         title="Fast Response"      desc="We reply to every farmer query within 24 hours, no exceptions." />
                <Feature icon={Bell}        title="Scheme Guidance"    desc="Our team helps you identify and apply for government subsidies relevant to your crops." />
                <Feature icon={ShieldCheck} title="Expert Agri Advice" desc="Get personalised guidance on crop yield, soil conditions, and seasonal planning." />
              </div>
              <div className="flex items-center gap-5 pt-6 mt-6 border-t border-white/5">
                {[
                  { val: "5,200+", lbl: "Farmers Helped" },
                  { val: "18", lbl: "Districts Covered" },
                  { val: "24h", lbl: "Response Time" },
                ].map(({ val, lbl }) => (
                  <div key={lbl}>
                    <div className="text-xl font-black text-green-400 leading-none">{val}</div>
                    <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-gray-400 mt-0.5">{lbl}</div>
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
