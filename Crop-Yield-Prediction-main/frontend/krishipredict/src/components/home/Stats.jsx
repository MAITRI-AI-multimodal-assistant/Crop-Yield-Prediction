import { motion } from "framer-motion";
import { Users, Target, Sprout, BarChart3, ArrowUpRight } from "lucide-react";

const stats = [
  { icon: Users,    value: "12,000", suffix: "+", label: "Farmers Empowered",    description: "Smallholder farmers across Eastern India using KrishiPredict",  color: "from-green-500 to-emerald-600",  glow: "rgba(0,166,81,0.3)" },
  { icon: Target,   value: "94",     suffix: "%",  label: "Prediction Accuracy",  description: "ML model accuracy on held-out Eastern India yield test sets",    color: "from-emerald-600 to-green-700",  glow: "rgba(5,150,105,0.3)" },
  { icon: Sprout,   value: "5",      suffix: "",   label: "Crops Supported",       description: "Rice, Maize, Jute, Banana, Coconut — models trained separately", color: "from-green-400 to-teal-500",     glow: "rgba(20,184,166,0.3)" },
  { icon: BarChart3,value: "90",     suffix: "%",  label: "Confidence Interval",   description: "Probabilistic yield band reported with every prediction",        color: "from-teal-500 to-green-600",     glow: "rgba(0,166,81,0.3)" },
];

export default function Stats() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-600/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black text-white leading-tight tracking-tight mb-3">
            Trusted Across{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Every Field</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Real numbers from real harvests — our models work quietly until planting season matters most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map(({ icon: Icon, value, suffix, label, description, color, glow }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 hover:border-green-500/30 hover:bg-white/5 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }} />
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4 shadow-lg`}>
                <Icon size={17} color="white" strokeWidth={2.2} />
              </div>
              <div className="flex items-end gap-0.5 mb-1">
                <span className={`text-[2.2rem] sm:text-[2.5rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{value}</span>
                <span className={`text-xl sm:text-2xl font-black leading-none pb-1 text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{suffix}</span>
              </div>
              <div className="text-[0.78rem] sm:text-sm font-bold tracking-wide text-white/80 mb-1.5 uppercase">{label}</div>
              <p className="text-[0.7rem] sm:text-xs text-gray-400 leading-relaxed">{description}</p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={14} className="text-green-500/60" />
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-10 sm:mt-12">
          {["NASA POWER Climate API", "SHAP Explainability", "90% Confidence Band"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[0.7rem] sm:text-xs font-semibold tracking-[0.08em] uppercase text-gray-300">
              <span className="w-1 h-1 rounded-full bg-green-500/60" /> {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
