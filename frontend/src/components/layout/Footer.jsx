import { Mail, Phone, MapPin, Github, Linkedin, Sprout, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import logoSvg from "../../assets/logo.svg";

export default function Footer() {
  const navLinks = [
    { name: "Predict",       path: "/predict" },
    { name: "Marketplace",   path: "/marketplace" },
    { name: "Notifications", path: "/notifications" },
    { name: "Login",         path: "/login" },
  ];

  const features = ["NASA Climate API", "SHAP Explanations", "Voice Input", "Direct Marketplace"];

  const socials = [
    { Icon: Github,   href: "https://github.com/", label: "GitHub" },
    { Icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-[#020805] border-t border-green-900/20 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 -left-20 w-72 h-72 bg-emerald-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logoSvg} alt="KrishiPredict" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              ML-powered crop yield prediction for farmers of Eastern India. NASA climate data, soil scanning, voice input — all in one platform.
            </p>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded bg-green-500/8 border border-green-500/20 text-gray-300 cursor-default">
                  <Zap size={9} /> {f}
                </span>
              ))}
            </div>
          </div>

          {/* Nav col */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[0.78rem] font-black tracking-[0.2em] uppercase text-green-500">Navigation</span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-500/40 to-transparent" />
            </div>
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path}
                  className="flex items-center gap-2 py-2 text-[0.85rem] font-semibold tracking-[0.08em] uppercase text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact col */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[0.78rem] font-black tracking-[0.2em] uppercase text-green-500">Contact</span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-500/40 to-transparent" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <Mail size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>krishipredict@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <Phone size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>+91 98300 00000</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>Kolkata, West Bengal</span>
              </div>
            </div>
          </div>

          {/* Compliance col */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[0.78rem] font-black tracking-[0.2em] uppercase text-green-500">Platform</span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-500/40 to-transparent" />
            </div>
            <div className="bg-green-500/6 border border-green-500/18 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sprout size={15} className="text-green-500" />
                <span className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-gray-300">ML Certified</span>
              </div>
              <p className="text-[0.75rem] text-gray-300 leading-relaxed">
                Trained on decades of Eastern India crop data. 94% prediction accuracy verified.
              </p>
            </div>
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/4 border border-white/8 text-gray-300 hover:bg-green-500/12 hover:border-green-500/35 hover:text-green-400 transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px my-9 bg-gradient-to-r from-transparent via-green-500/25 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.75rem] tracking-[0.08em] text-gray-300">
            © 2024 KrishiPredict · Eastern India. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse" />
            <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-gray-300">AI models online</span>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms"].map((t) => (
              <span key={t} className="text-[0.72rem] tracking-[0.08em] uppercase text-gray-300 cursor-default">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
