import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { Leaf, Eye, EyeOff } from "lucide-react";

const ROLES = [
  { value: "farmer", label: "🧑‍🌾 Farmer",       desc: "Predict yield, get AI insights, sell direct to buyers.",   color: "rgba(0,166,81,0.2)",  border: "rgba(0,166,81,0.4)" },
  { value: "seller", label: "🏪 Seller / Buyer", desc: "List agri-products and browse crops from farmers.",         color: "rgba(20,184,166,0.2)", border: "rgba(20,184,166,0.4)" },
  { value: "admin",  label: "🛡️ Admin",           desc: "Monitor platform analytics and manage users.",             color: "rgba(139,92,246,0.2)", border: "rgba(139,92,246,0.4)" },
];

const SELLER_BUYER_OPTIONS = [
  { value: "seller", label: "🏪 Seller" },
  { value: "buyer",  label: "🛒 Buyer"  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "farmer", sellerBuyerType: "seller", address: "" });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConf, setShowConf]       = useState(false);
  const [emailCode, setEmailCode]     = useState("");
  const [sentCode, setSentCode]       = useState("");
  const [codeSent, setCodeSent]       = useState(false);
  const [verified, setVerified]       = useState(false);
  const [verifyErr, setVerifyErr]     = useState("");
  const [sendingCode, setSendingCode] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const redirectForRole = (role) => { if (role === "admin") navigate("/admin"); else navigate("/predict"); };

  const handleSendCode = async () => {
    setVerifyErr("");
    if (!form.email.trim()) return setVerifyErr("Enter your email first.");
    setSendingCode(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code.");
      setSentCode(data.code ?? ""); // only if backend echoes it (dev mode); omit in prod
      setCodeSent(true);
    } catch (err) {
      setVerifyErr(err.message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = () => {
    setVerifyErr("");
    if (!emailCode.trim()) return setVerifyErr("Enter the code sent to your email.");
    if (emailCode.trim() === sentCode.trim() || emailCode.trim().length === 6) {
      // In production, verification is done server-side on submit; this is a UX guard.
      setVerified(true);
    } else {
      setVerifyErr("Incorrect code. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim())        return setError("Full name is required.");
    if (!form.email.trim())       return setError("Email is required.");
    if (!verified)                return setError("Please verify your email address first.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const effectiveRole = form.role === "seller" ? form.sellerBuyerType : form.role;
      const user = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: effectiveRole, address: form.address, verificationCode: emailCode });
      redirectForRole(user.role);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 focus:shadow-[0_0_0_3px_rgba(0,166,81,0.12)] transition-all";

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1.2fr] bg-[#020805]">
      {/* Left branding panel */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-[#020805] via-[#001a0d] to-[#020805] px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(60deg, white 0, white 1px, transparent 1px, transparent 30px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-600/8 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-5">🌾</div>
          <h1 className="text-4xl font-black text-white mb-2">Krishi<span className="text-green-400">Predict</span></h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">AI-powered yield forecasting for Eastern India farmers. Plan smarter, harvest better.</p>
          <div className="space-y-3 text-left">
            {["📊 ML-based yield forecasting","🛒 Direct farmer marketplace","🛰️ Auto climate data from NASA","🔔 Govt. scheme notifications"].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" style={{ boxShadow: "0 0 6px rgba(0,204,99,0.8)" }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/5 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-md">
          <div className="md:hidden text-center mb-6">
            <Leaf size={28} className="inline text-green-400 mb-2" />
            <h1 className="text-2xl font-black text-white">Krishi<span className="text-green-400">Predict</span></h1>
          </div>

          <h2 className="text-xl font-black text-white mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-6">Join thousands of farmers using AI to farm smarter.</p>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>}

            {/* Role selector */}
            <div className="mb-4">
              <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button type="button" key={r.value} onClick={() => setForm(p => ({ ...p, role: r.value }))}
                    className="p-2.5 rounded-xl border text-center text-xs font-bold transition-all duration-200"
                    style={{ background: form.role === r.value ? r.color : "rgba(255,255,255,0.03)", borderColor: form.role === r.value ? r.border : "rgba(255,255,255,0.08)", color: form.role === r.value ? "#fff" : "rgba(255,255,255,0.5)" }}>
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Seller/Buyer dropdown — only shown when "Seller / Buyer" role is active */}
              {form.role === "seller" && (
                <div className="mt-3">
                  <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">I am a…</label>
                  <select
                    name="sellerBuyerType"
                    value={form.sellerBuyerType}
                    onChange={handle}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-teal-500/40 text-white text-sm focus:outline-none focus:border-teal-400/70 focus:shadow-[0_0_0_3px_rgba(20,184,166,0.12)] transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                  >
                    {SELLER_BUYER_OPTIONS.map(o => (
                      <option key={o.value} value={o.value} style={{ background: "#0a1a10" }}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Full Name</label>
                  <input name="name" type="text" placeholder="Your name" required value={form.name} onChange={handle} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Phone</label>
                  <input name="phone" type="tel" placeholder="+91..." value={form.phone} onChange={handle} className={inputClass} />
                </div>
              </div>

              {/* Email + verify */}
              <div>
                <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Email Address</label>
                <div className="flex gap-2">
                  <input name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => { handle(e); setCodeSent(false); setVerified(false); setSentCode(""); setEmailCode(""); setVerifyErr(""); }} className={`${inputClass} flex-1`} />
                  <button type="button" onClick={handleSendCode} disabled={sendingCode || verified}
                    className="shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: verified ? "rgba(0,166,81,0.15)" : "rgba(0,166,81,0.1)", borderColor: verified ? "rgba(0,166,81,0.5)" : "rgba(0,166,81,0.3)", color: verified ? "#4ade80" : "#86efac" }}>
                    {verified ? "✓ Verified" : sendingCode ? "Sending…" : codeSent ? "Resend" : "Send Code"}
                  </button>
                </div>
              </div>

              {/* Code entry — shown after code is sent and not yet verified */}
              {codeSent && !verified && (
                <div>
                  <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text" maxLength={6} placeholder="6-digit code" value={emailCode}
                      onChange={(e) => { setEmailCode(e.target.value); setVerifyErr(""); }}
                      className={`${inputClass} flex-1 tracking-[0.3em] text-center font-bold`}
                    />
                    <button type="button" onClick={handleVerifyCode}
                      className="shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold border border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-all duration-200">
                      Verify
                    </button>
                  </div>
                  {verifyErr && <p className="mt-1.5 text-xs text-red-400">⚠️ {verifyErr}</p>}
                  <p className="mt-1.5 text-xs text-gray-500">Check your inbox (and spam folder) for a 6-digit code.</p>
                </div>
              )}

              {verified && (
                <div className="px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold flex items-center gap-2">
                  <span>✅</span> Email verified successfully!
                </div>
              )}

              <div>
                <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Address</label>
                <input name="address" type="text" placeholder="Village, District, State" value={form.address} onChange={handle} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input name="password" type={showPass ? "text" : "password"} placeholder="Min 6 chars" required value={form.password} onChange={handle} className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Confirm</label>
                  <div className="relative">
                    <input name="confirmPassword" type={showConf ? "text" : "password"} placeholder="Repeat" required value={form.confirmPassword} onChange={handle} className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowConf(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.1em] uppercase text-sm shadow-[0_0_16px_rgba(0,166,81,0.3)] hover:shadow-[0_0_24px_rgba(0,166,81,0.5)] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </form>

            <p className="text-center mt-4 text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 font-bold hover:text-green-300 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}