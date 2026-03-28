import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { Leaf, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const redirectForRole = (user) => {
    if (user.role === "admin") navigate("/admin");
    else navigate("/predict");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser({ email: form.email, password: form.password });
      redirectForRole(user);
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020805] px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-green-600/8 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-800/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl shadow-[0_0_24px_rgba(0,166,81,0.5)] mb-4">
            <Leaf size={28} color="white" strokeWidth={2.2} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Krishi<span className="text-green-400">Predict</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 focus:shadow-[0_0_0_3px_rgba(0,166,81,0.12)] transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[0.72rem] font-bold tracking-[0.12em] uppercase text-gray-400">Password</label>
                <span className="text-[0.72rem] text-green-500 cursor-pointer hover:text-green-400 transition-colors">Forgot password?</span>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} placeholder="Your password" required
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 focus:shadow-[0_0_0_3px_rgba(0,166,81,0.12)] transition-all"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.1em] uppercase text-sm shadow-[0_0_16px_rgba(0,166,81,0.3)] hover:shadow-[0_0_24px_rgba(0,166,81,0.5)] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 font-bold hover:text-green-300 transition-colors">Register free</Link>
          </p>
        </div>

        <div className="mt-4 px-4 py-2.5 bg-white/3 border border-white/6 rounded-xl text-center text-[0.7rem] text-gray-500">
          💡 Admin? Use <strong className="text-gray-400">admin@krishipredict.com</strong> to access the dashboard.
        </div>
      </div>
    </div>
  );
}