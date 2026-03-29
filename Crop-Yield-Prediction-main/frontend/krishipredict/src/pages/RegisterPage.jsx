import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, ADMIN_EMAIL } from "../api/auth";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { Leaf, Eye, EyeOff } from "lucide-react";

const ROLES = [
  { value: "farmer", label: "🧑‍🌾 Farmer",       desc: "Predict yield, get AI insights, sell direct to buyers.",   color: "rgba(0,166,81,0.2)",  border: "rgba(0,166,81,0.4)" },
  { value: "seller", label: "🏪 Seller / Buyer", desc: "List agri-products and browse crops from farmers.",         color: "rgba(20,184,166,0.2)", border: "rgba(20,184,166,0.4)" },
  { value: "admin",  label: "🛡️ Admin",           desc: "Monitor platform analytics and manage users.",             color: "rgba(139,92,246,0.2)", border: "rgba(139,92,246,0.4)" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "farmer", address: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const redirectForRole = (role) => { if (role === "admin") navigate("/admin"); else navigate("/predict"); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim())        return setError("Full name is required.");
    if (!form.email.trim())       return setError("Email is required.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const user = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, address: form.address });
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
            <GoogleAuthButton label="Register with Google" onSuccess={(u) => redirectForRole(u.role)} onError={setError} mode="register" />

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">or register with email</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

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
              <div>
                <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={handle} className={inputClass} />
              </div>
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
