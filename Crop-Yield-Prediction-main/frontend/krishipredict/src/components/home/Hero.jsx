import { motion } from "framer-motion";
import { ArrowRight, Leaf, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const stats = [
    { value: "94%",  label: "Accuracy" },
    { value: "12K+", label: "Farmers" },
    { value: "5",    label: "Crops" },
  ];

  return (
    <section className="relative min-h-screen flex mt-5 items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1280&q=80"
        alt="Farm background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-24 sm:h-36 bg-green-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 sm:py-20 min-h-screen">

        <div className="w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto mb-4 sm:mb-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(1.7rem,5vw,3.6rem)] font-black leading-[1.08] tracking-tight"
          >
            <span className="text-white">SMART AI YIELD </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              PREDICTION FOR
            </span>
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[clamp(1.7rem,5vw,3.6rem)] font-black text-white leading-[1.08] tracking-tight"
          >
            EVERY FARMER
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="text-gray-300 text-[0.8rem] sm:text-sm md:text-base font-medium leading-relaxed max-w-[290px] sm:max-w-md md:max-w-xl mx-auto mb-5 sm:mb-6"
        >
          ML-powered crop yield forecasting for Eastern India farmers. NASA climate data, soil scanning, voice input in Bengali — plan smarter, harvest better.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.46 }}
          className="flex flex-wrap justify-center gap-5 sm:gap-8 md:gap-12 mb-5 sm:mb-6"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center min-w-[48px] sm:min-w-[60px]">
              <div className="text-[1.1rem] sm:text-xl md:text-2xl font-black text-green-400 leading-none mb-0.5">{value}</div>
              <div className="text-[0.5rem] sm:text-[0.58rem] font-bold tracking-[0.12em] uppercase text-gray-400 whitespace-nowrap">{label}</div>
            </div>
          ))}
        </motion.div>

        <div className="w-36 sm:w-64 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5 sm:mb-6" />

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.54 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mb-5 sm:mb-6 w-full max-w-[280px] sm:max-w-none mx-auto"
        >
          <Link to="/predict" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.1em] uppercase text-[0.7rem] sm:text-xs rounded-xl shadow-[0_0_18px_rgba(0,166,81,0.4)] hover:shadow-[0_0_28px_rgba(0,166,81,0.6)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
              <Leaf size={13} />
              Start Free Prediction
              <ArrowRight size={13} />
            </button>
          </Link>
          <Link to="/marketplace" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl border border-white/20 bg-white/5 text-white/75 font-bold tracking-[0.08em] uppercase text-[0.7rem] sm:text-xs hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-200 whitespace-nowrap">
              <Shield size={13} />
              View Marketplace
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
