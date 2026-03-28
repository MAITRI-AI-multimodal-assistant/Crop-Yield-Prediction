import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Bell, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { id: "all",     label: "All",           icon: "📋" },
  { id: "scheme",  label: "Schemes",       icon: "🏛️" },
  { id: "weather", label: "Weather",       icon: "🌧️" },
  { id: "market",  label: "Market Prices", icon: "📈" },
  { id: "advisory",label: "Advisory",      icon: "💡" },
];

const MOCK = [
  { id:1, category:"scheme",   title:"PM-KISAN 16th Installment Released",              body:"₹2,000 transferred to eligible farmers under PM-KISAN scheme. Check your bank account by Nov 15, 2024.", date:"Nov 5, 2024",  badge:"New",   important:true  },
  { id:2, category:"weather",  title:"Cyclone Warning – Coastal West Bengal",            body:"IMD has issued a cyclone alert for coastal districts. Harvest standing crops immediately.",               date:"Nov 4, 2024",  badge:"Alert", important:true  },
  { id:3, category:"market",   title:"Rice MSP Increased to ₹2,300/quintal",             body:"Government revises paddy MSP for Kharif 2024-25 by ₹143 over previous year.",                            date:"Nov 3, 2024",  badge:"",      important:false },
  { id:4, category:"advisory", title:"Soil Health Card Renewal Campaign",                body:"Visit your nearest KVK to get a free updated soil health card before December 2024.",                     date:"Nov 2, 2024",  badge:"",      important:false },
  { id:5, category:"scheme",   title:"Kisan Credit Card – Interest Subvention",          body:"3% interest subvention available on KCC loans up to ₹3 lakh. Apply before March 31, 2025.",              date:"Oct 30, 2024", badge:"",      important:false },
  { id:6, category:"market",   title:"Jute Futures Up 8% on MCX",                        body:"Jute prices surge on export demand. Lock in contracts early for the next harvest.",                       date:"Oct 28, 2024", badge:"",      important:false },
  { id:7, category:"advisory", title:"Late Blight Alert – Potato in Bihar",              body:"Disease pressure forecast is high for the next 10 days. Apply Mancozeb 75% WP as a preventive measure.", date:"Oct 25, 2024", badge:"",      important:false },
  { id:8, category:"scheme",   title:"Pradhan Mantri Fasal Bima Yojana Enrolment",       body:"Last date for PMFBY enrolment for Rabi 2024-25 is November 30. Contact your nearest bank branch.",      date:"Oct 22, 2024", badge:"",      important:false },
];

export default function NotificationsPage() {
  const [active, setActive]   = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = active === "all" ? MOCK : MOCK.filter(n => n.category === active);

  const catColor = { scheme:"from-green-500 to-emerald-600", weather:"from-blue-500 to-cyan-600", market:"from-teal-500 to-green-600", advisory:"from-emerald-500 to-green-700" };
  const catGlow  = { scheme:"rgba(0,166,81,0.25)", weather:"rgba(59,130,246,0.25)", market:"rgba(20,184,166,0.25)", advisory:"rgba(5,150,105,0.25)" };

  return (
    <div className="min-h-screen bg-[#020805]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Bell size={11} className="text-green-400" />
            <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Govt. Schemes & Alerts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Notifications & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Schemes</span>
          </h1>
          <p className="text-gray-400 text-sm">Government schemes, weather alerts and market intelligence for Eastern India farmers.</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-bold tracking-wide uppercase transition-all duration-200 ${
                active === c.id
                  ? "bg-green-500/15 border-green-500/40 text-green-400"
                  : "bg-white/3 border-white/8 text-gray-400 hover:border-green-500/25 hover:text-gray-300"
              }`}>
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {filtered.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                expanded === n.id
                  ? "border-green-500/35 bg-white/5"
                  : "border-white/8 bg-white/3 hover:border-green-500/20 hover:bg-white/4"
              }`}
              onClick={() => setExpanded(expanded === n.id ? null : n.id)}>
              {n.important && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${catColor[n.category] || "from-green-500 to-emerald-600"}`} />
              )}
              <div className={`${n.important ? "pl-4" : ""} px-5 py-4 flex items-center justify-between gap-4`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${catColor[n.category] || "from-green-500 to-emerald-600"} shrink-0 shadow-lg`}>
                    <span className="text-sm">{CATEGORIES.find(c => c.id === n.category)?.icon || "📋"}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-black text-sm tracking-wide truncate transition-colors ${expanded === n.id ? "text-green-400" : "text-white/85 group-hover:text-white"}`}>
                        {n.title}
                      </h3>
                      {n.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider ${n.badge === "Alert" ? "bg-red-500/15 text-red-400 border border-red-500/25" : "bg-green-500/15 text-green-400 border border-green-500/25"}`}>
                          {n.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{n.date}</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: expanded === n.id ? 180 : 0 }} transition={{ duration: 0.25 }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 transition-all ${
                    expanded === n.id ? "bg-green-500/15 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-white/40"
                  }`}>
                  <ChevronDown size={13} />
                </motion.div>
              </div>
              {expanded === n.id && (
                <div className="px-5 pb-4 pl-16">
                  <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-3" />
                  <p className="text-gray-300 text-sm leading-relaxed">{n.body}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
