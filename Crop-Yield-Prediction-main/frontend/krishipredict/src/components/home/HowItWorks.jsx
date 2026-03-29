import { motion } from "framer-motion";
import { ClipboardList, Bot, Rocket, ArrowUpRight } from "lucide-react";

const steps = [
  { n: "01", icon: ClipboardList, title: "Enter Details",  desc: "Fill crop, land and soil data — speak in Bengali or let NASA fill climate automatically.", color: "from-green-500 to-emerald-600", glow: "rgba(0,166,81,0.25)" },
  { n: "02", icon: Bot,           title: "AI Predicts",    desc: "Our ML model weighs 15 parameters and returns probabilistic yield with a 90% confidence band.", color: "from-emerald-600 to-green-700", glow: "rgba(5,150,105,0.25)" },
  { n: "03", icon: Rocket,        title: "Take Action",    desc: "Review SHAP insights, income range and agronomic tips. Then sell direct on the marketplace.", color: "from-teal-500 to-green-600", glow: "rgba(20,184,166,0.25)" },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-green-700/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black text-white leading-tight tracking-tight mb-3">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Works</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Three steps to your personalised yield forecast.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {steps.map(({ n, icon: Icon, title, desc, color, glow }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 hover:border-green-500/30 hover:bg-white/5 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }} />
              <div className="absolute top-4 right-5 text-[5rem] font-black text-white/[0.04] leading-none select-none">{n}</div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4 shadow-lg`}>
                <Icon size={18} color="white" strokeWidth={2.2} />
              </div>
              <h3 className="text-white font-black text-sm sm:text-base tracking-wide uppercase mb-2">{title}</h3>
              <div className="h-px bg-gradient-to-r from-white/8 to-transparent mb-3" />
              <p className="text-gray-400 text-[0.72rem] sm:text-xs leading-relaxed">{desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
