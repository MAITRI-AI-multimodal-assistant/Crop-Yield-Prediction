import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does KrishiPredict forecast crop yield?", a: "Our model uses 15 agronomic and climate parameters — soil NPK, pH, rainfall, temperature, humidity, NDVI and more — fed into an ensemble ML model trained on decades of Eastern India data. It returns a probabilistic yield with a 90% confidence band." },
  { q: "Is it compatible with all crops?", a: "Currently we support Rice, Maize, Jute, Banana and Coconut — the five most economically significant crops in Eastern India. Each has its own dedicated model trained on region-specific data." },
  { q: "How does the Soil Strip Scanner work?", a: "Point your phone camera at a standard soil test strip. Our CV model reads the colour bands and extracts N, P, K and pH values in real time, filling the form automatically." },
  { q: "What is the NASA POWER integration?", a: "When you select your state, KrishiPredict calls the NASA POWER API to fetch real satellite-derived rainfall, temperature and humidity for that region — no manual entry needed." },
  { q: "What languages does Voice Input support?", a: "Currently Bengali (bn-IN) and Hindi (hi-IN). You can speak your crop details naturally and the AI parses and fills every field in the prediction form." },
  { q: "What are SHAP explanations?", a: "SHAP (SHapley Additive exPlanations) show which input factors most influenced your yield prediction — e.g. 'low soil nitrogen reduced predicted yield by 0.4 t/ha'. This turns a black-box model into an actionable insight." },
  { q: "How does the Marketplace work?", a: "After registration, farmers can list their harvest with quantity, price and location. Verified buyers across India can browse and contact sellers directly, cutting out the middleman." },
  { q: "Is KrishiPredict free for farmers?", a: "Yes. Prediction, voice input, soil scanning and marketplace listing are all free for registered farmers. Buyer-side premium features may have a small subscription in the future." },
];

const FAQItem = ({ q, a, isOpen, onToggle, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
    className={`group border rounded-xl overflow-hidden transition-all duration-300 ${
      isOpen ? "border-green-500/35 bg-white/5" : "border-white/8 bg-white/3 hover:border-green-500/20 hover:bg-white/4"
    }`}
  >
    <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left">
      <span className={`text-sm sm:text-base font-bold tracking-wide transition-colors duration-200 ${isOpen ? "text-green-400" : "text-white/80 group-hover:text-white"}`}>
        {q}
      </span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}
        className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-200 ${
          isOpen ? "bg-green-500/15 border-green-500/35 text-green-400" : "bg-white/5 border-white/10 text-white/40"
        }`}>
        <ChevronDown size={14} />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5">
            <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-4" />
            <p className="text-gray-300 text-sm leading-relaxed">{a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-green-700/5 blur-3xl rounded-full pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black text-white leading-tight tracking-tight mb-3">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Questions</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Everything you need to know before your first prediction.
          </p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} {...faq} i={i} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
