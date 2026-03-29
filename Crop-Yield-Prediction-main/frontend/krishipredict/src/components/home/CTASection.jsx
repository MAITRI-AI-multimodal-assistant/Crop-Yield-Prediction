import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="text-5xl mb-5">🌾</div>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black text-white leading-tight tracking-tight mb-4">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Predict Your Harvest?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
            Join 12,000+ farmers using AI to plan smarter seasons and maximise income.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/predict">
              <button className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.1em] uppercase text-sm rounded-xl shadow-[0_0_18px_rgba(0,166,81,0.4)] hover:shadow-[0_0_28px_rgba(0,166,81,0.6)] hover:-translate-y-0.5 transition-all duration-200">
                <Leaf size={15} /> Start Free Prediction <ArrowRight size={15} />
              </button>
            </Link>
            <Link to="/register">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white/75 font-bold tracking-[0.08em] uppercase text-sm hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-200">
                Create Free Account
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
