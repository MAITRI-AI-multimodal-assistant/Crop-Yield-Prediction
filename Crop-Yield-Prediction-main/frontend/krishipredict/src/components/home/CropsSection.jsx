import { motion } from "framer-motion";

const CropIcon = ({ type }) => {
  const icons = {
    rice: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <path d="M18 4 C18 4 10 10 10 20 C10 27 13.5 32 18 32 C22.5 32 26 27 26 20 C26 10 18 4 18 4Z" fill="currentColor" opacity="0.9"/>
        <line x1="18" y1="32" x2="18" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="18" y1="18" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <line x1="18" y1="23" x2="24" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      </svg>
    ),
    maize: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <ellipse cx="18" cy="19" rx="7" ry="11" fill="currentColor" opacity="0.9"/>
        <line x1="18" y1="30" x2="18" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="11" y1="19" x2="5" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <line x1="25" y1="16" x2="31" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <circle cx="15" cy="16" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="18" cy="15" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="21" cy="16" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="15" cy="19" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="18" cy="18" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="21" cy="19" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="15" cy="22" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="18" cy="21" r="1.2" fill="#020805" opacity="0.5"/>
        <circle cx="21" cy="22" r="1.2" fill="#020805" opacity="0.5"/>
      </svg>
    ),
    jute: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <line x1="18" y1="32" x2="18" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 12 C18 12 10 14 9 20 C10 22 14 22 18 18" fill="currentColor" opacity="0.85"/>
        <path d="M18 18 C18 18 26 16 27 22 C26 24 22 24 18 20" fill="currentColor" opacity="0.7"/>
        <path d="M18 22 C18 22 12 23 11 28 C13 30 16 29 18 26" fill="currentColor" opacity="0.55"/>
      </svg>
    ),
    banana: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <path d="M8 28 C8 28 10 16 18 11 C26 6 30 10 30 14 C30 18 24 14 18 17 C12 20 10 28 10 28Z" fill="currentColor" opacity="0.9"/>
        <path d="M9 27 C9 27 11 20 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <circle cx="30" cy="12" r="3" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    coconut: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <line x1="18" y1="32" x2="18" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 14 C18 14 6 8 5 4 C8 2 14 6 18 10" fill="currentColor" opacity="0.7"/>
        <path d="M18 14 C18 14 30 8 31 4 C28 2 22 6 18 10" fill="currentColor" opacity="0.55"/>
        <path d="M18 14 C18 14 18 4 16 2 C19 2 20 8 18 14" fill="currentColor" opacity="0.4"/>
        <ellipse cx="18" cy="26" rx="6" ry="7" fill="currentColor" opacity="0.9"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const crops = [
  { name: "Rice",    type: "rice",    season: "Kharif",        avg: "2.8 t/ha", color: "from-green-500 to-emerald-600",  glow: "rgba(0,166,81,0.25)",   iconColor: "#4ade80" },
  { name: "Maize",   type: "maize",   season: "Kharif / Rabi", avg: "3.2 t/ha", color: "from-emerald-600 to-green-700",  glow: "rgba(5,150,105,0.25)",  iconColor: "#34d399" },
  { name: "Jute",    type: "jute",    season: "Kharif",        avg: "2.1 t/ha", color: "from-teal-500 to-green-600",     glow: "rgba(20,184,166,0.25)", iconColor: "#2dd4bf" },
  { name: "Banana",  type: "banana",  season: "Whole Year",    avg: "18 t/ha",  color: "from-green-400 to-teal-500",     glow: "rgba(0,166,81,0.25)",   iconColor: "#6ee7b7" },
  { name: "Coconut", type: "coconut", season: "Whole Year",    avg: "11 t/ha",  color: "from-emerald-500 to-green-600",  glow: "rgba(5,150,105,0.25)",  iconColor: "#a7f3d0" },
];

export default function CropsSection() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-700/5 blur-3xl rounded-full pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black text-white leading-tight tracking-tight mb-3">
            Supported{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Crops</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Precision ML models trained on decades of Eastern India agricultural data.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {crops.map(({ name, type, season, avg, color, glow, iconColor }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6 hover:border-green-500/30 hover:bg-white/5 transition-all duration-300 overflow-hidden text-center">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }} />
              <div className="flex justify-center mb-3" style={{ color: iconColor }}>
                <CropIcon type={type} />
              </div>
              <h3 className="text-white font-black text-sm sm:text-base tracking-wide uppercase mb-1">{name}</h3>
              <div className="h-px bg-gradient-to-r from-white/8 to-transparent mb-2" />
              <p className="text-gray-400 text-[0.7rem] leading-relaxed">{season}</p>
              <p className={`text-[0.72rem] font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r ${color}`}>Avg {avg}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
