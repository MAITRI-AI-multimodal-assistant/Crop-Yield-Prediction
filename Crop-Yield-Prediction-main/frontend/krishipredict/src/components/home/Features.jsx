import { motion } from "framer-motion";
import { Satellite, ScanLine, Mic, BarChart2, ShoppingBag, Banknote, ArrowUpRight, CheckCircle } from "lucide-react";

const features = [
  { icon: Satellite,   title: "NASA Climate Data",   desc: "Rainfall, temperature and humidity auto-fetched from NASA POWER API the moment you select your state.", bullets: ["Auto-filled climate fields", "Real-time satellite data"], color: "from-green-500 to-emerald-600", glow: "rgba(0,166,81,0.28)" },
  { icon: ScanLine,    title: "Soil Strip Scanner",  desc: "Point your phone camera at a soil test strip. AI reads N, P, K and pH values and fills the form instantly.", bullets: ["Camera-based soil reading", "Instant NPK & pH parsing"], color: "from-emerald-600 to-green-700", glow: "rgba(5,150,105,0.28)" },
  { icon: Mic,         title: "Voice Input",         desc: "Speak your crop details in Bengali or Hindi. Our AI parses your language and populates every field.", bullets: ["Bengali & Hindi support", "Full form auto-fill"], color: "from-teal-500 to-green-600", glow: "rgba(20,184,166,0.28)" },
  { icon: BarChart2,   title: "SHAP Explanations",   desc: "See exactly which soil and climate factors drive your prediction — not just a number, but the full story.", bullets: ["Feature importance chart", "Plain-language advice"], color: "from-green-400 to-teal-500", glow: "rgba(0,166,81,0.28)" },
  { icon: ShoppingBag, title: "Direct Marketplace",  desc: "List your harvest directly to verified buyers across India. Cut out middlemen. Keep more of your income.", bullets: ["Verified buyer network", "Direct farmer listing"], color: "from-emerald-500 to-green-600", glow: "rgba(5,150,105,0.28)" },
  { icon: Banknote,    title: "Income Forecasting",  desc: "Get min/max income estimates before you plant a single seed. Plan smarter, harvest better.", bullets: ["Min-max income range", "Pre-planting planning"], color: "from-green-600 to-emerald-700", glow: "rgba(0,166,81,0.28)" },
];

export default function Features() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-700/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black text-white leading-tight tracking-tight mb-3">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Farm Smarter</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Built ground-up for the small and marginal farmers of Eastern India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map(({ icon: Icon, title, desc, bullets, color, glow }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 hover:border-green-500/30 hover:bg-white/5 transition-all duration-300 overflow-hidden flex flex-col">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4 shadow-lg shrink-0`}>
                <Icon size={18} color="white" strokeWidth={2.2} />
              </div>
              <h3 className="text-white font-black text-sm sm:text-base tracking-wide mb-2 uppercase">{title}</h3>
              <p className="text-gray-400 text-[0.75rem] sm:text-xs leading-relaxed mb-4">{desc}</p>
              <div className="h-px bg-gradient-to-r from-white/8 to-transparent mb-4" />
              <ul className="space-y-2 mt-auto">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[0.7rem] sm:text-[0.72rem] text-gray-300 font-medium">
                    <CheckCircle size={11} className="text-green-500 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={14} className="text-green-500/60" />
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-10 sm:mt-12">
          {["Works With All Major Crops", "Free for Farmers"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[0.7rem] sm:text-xs font-semibold tracking-[0.08em] uppercase text-gray-300">
              <span className="w-1 h-1 rounded-full bg-green-500/60" /> {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
