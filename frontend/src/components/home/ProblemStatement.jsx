import { motion } from "framer-motion";
import { TrendingDown, CloudRain, IndianRupee, CheckCircle, Sprout } from "lucide-react";

const problems = [
  { icon: TrendingDown, stat: "40%",       label: "Income Lost to Guesswork",    desc: "Farmers without yield data plant suboptimally, losing up to 40% of potential income to incorrect fertiliser and seed decisions.",    color: "from-red-600 to-rose-700",      glow: "rgba(220,38,38,0.28)" },
  { icon: CloudRain,    stat: "60%",       label: "Climate Uncertainty",          desc: "60% of Eastern India farmers cite unpredictable monsoons as their top risk — without data, they cannot plan seasons in advance.",       color: "from-green-500 to-emerald-600", glow: "rgba(0,166,81,0.28)" },
  { icon: IndianRupee,  stat: "₹8,000 Cr", label: "Middleman Losses Annually",   desc: "Indian farmers lose over ₹8,000 crore annually to commission agents and traders — direct marketplace access changes this equation.",    color: "from-emerald-600 to-green-700", glow: "rgba(5,150,105,0.28)" },
];

const solutions = [
  { text: "Predicts yield before planting",           color: "from-green-500 to-emerald-600", glow: "rgba(0,166,81,0.25)" },
  { text: "NASA satellite climate data auto-fetched", color: "from-emerald-600 to-green-700", glow: "rgba(5,150,105,0.25)" },
  { text: "SHAP-backed agronomic advice",             color: "from-teal-500 to-green-600",    glow: "rgba(20,184,166,0.25)" },
  { text: "Direct buyer-farmer marketplace",          color: "from-green-400 to-teal-500",    glow: "rgba(0,166,81,0.25)" },
];

export default function ProblemStatement() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-green-700/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black text-white leading-tight tracking-tight mb-3">
            Farming Without Data is a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Silent Loss</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Most smallholder farmers in Eastern India make planting decisions on intuition alone — KrishiPredict changes that.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-14">
          {problems.map(({ icon: Icon, stat, label, desc, color, glow }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 hover:border-green-500/30 hover:bg-white/5 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4 shadow-lg`}>
                <Icon size={18} color="white" strokeWidth={2.2} />
              </div>
              <div className={`text-[2rem] font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{stat}</div>
              <h3 className="text-white font-black text-sm sm:text-base tracking-wide uppercase mb-2">{label}</h3>
              <div className="h-px bg-gradient-to-r from-white/8 to-transparent mb-3" />
              <p className="text-gray-400 text-[0.72rem] sm:text-xs leading-relaxed">{desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
            </motion.div>
          ))}
        </div>

        {/* Solution strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative bg-white/3 border border-green-500/15 rounded-2xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Sprout size={18} color="white" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-white font-black text-base sm:text-lg tracking-wide uppercase">KrishiPredict's Answer</h3>
              <p className="text-gray-400 text-xs">Data-driven farming for every smallholder</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {solutions.map(({ text, color, glow }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                <span className="text-gray-300 text-[0.78rem] font-semibold">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
