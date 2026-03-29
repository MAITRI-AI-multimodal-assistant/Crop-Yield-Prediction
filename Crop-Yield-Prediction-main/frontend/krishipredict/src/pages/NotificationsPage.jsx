import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Bell, ChevronDown, Search, ExternalLink,
  AlertTriangle, X, Check,
} from "lucide-react";

/* ─── Categories ─── */
const CATEGORIES = [
  { id: "all",      label: "All",             icon: "📋" },
  { id: "scheme",   label: "Govt Schemes",    icon: "🏛️" },
  { id: "subsidy",  label: "Subsidies",       icon: "💰" },
  { id: "weather",  label: "Weather Alerts",  icon: "🌧️" },
  { id: "market",   label: "Market Prices",   icon: "📈" },
  { id: "advisory", label: "Agri Advisory",   icon: "💡" },
];

/* ─── Comprehensive Indian Govt Schemes & Subsidy data ─── */
const NOTIFICATIONS = [
  {
    id: 1, category: "scheme", badge: "New", important: true,
    title: "PM-KISAN 18th Installment — ₹2,000 Released",
    body: "The 18th installment of Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) has been released. Eligible small and marginal farmers will receive ₹2,000 directly to their Aadhaar-linked bank accounts. Beneficiaries can check their status at pmkisan.gov.in or through the PM-KISAN app.",
    date: "Mar 20, 2025", link: "https://pmkisan.gov.in", linkLabel: "Check Status",
    tags: ["Eastern India", "All Crops"],
  },
  {
    id: 2, category: "scheme", badge: "Open", important: true,
    title: "PMFBY Rabi 2024-25 — Enrolment Deadline Apr 30",
    body: "Pradhan Mantri Fasal Bima Yojana (PMFBY) enrolment for Rabi 2024-25 is open till April 30, 2025. Farmers growing wheat, potato, mustard and other Rabi crops should contact their nearest bank branch or Common Service Centre (CSC). Premium is just 1.5% for Rabi crops.",
    date: "Mar 18, 2025", link: "https://pmfby.gov.in", linkLabel: "Enrol Now",
    tags: ["Rabi Crops", "Insurance"],
  },
  {
    id: 3, category: "scheme", badge: "", important: false,
    title: "Kisan Credit Card (KCC) — 3% Interest Subvention Available",
    body: "Farmers with KCC loans up to ₹3 lakh are eligible for 3% per annum interest subvention under the Modified Interest Subvention Scheme (MISS). Prompt repayment earns an additional 3% prompt repayment incentive, effectively making loans available at 4% p.a. Apply at your nearest bank branch.",
    date: "Mar 15, 2025", link: "https://nabard.org/content.aspx?id=572", linkLabel: "Learn More",
    tags: ["Credit", "All Farmers"],
  },
  {
    id: 4, category: "scheme", badge: "", important: false,
    title: "e-NAM Platform — Register for Direct Market Access",
    body: "National Agriculture Market (e-NAM) enables farmers to sell produce online across 1,000+ mandis. Registration is free. Eastern India farmers can now list rice, jute, potato, and vegetables directly. Integrated with APMC reforms for better price realization and reduced intermediary costs.",
    date: "Mar 5, 2025", link: "https://enam.gov.in", linkLabel: "Register on e-NAM",
    tags: ["Market Access", "All Crops"],
  },
  {
    id: 5, category: "scheme", badge: "", important: false,
    title: "NMSA — Water Use Efficiency Grants for West Bengal",
    body: "Grants available under National Mission for Sustainable Agriculture (NMSA) for micro-irrigation systems. West Bengal farmers can avail up to 55% subsidy on drip and sprinkler equipment through District Agriculture Offices. Jal Shakti Abhiyan integration provides additional support.",
    date: "Mar 10, 2025", link: "https://nmsa.dac.gov.in", linkLabel: "Apply via DAO",
    tags: ["Irrigation", "West Bengal"],
  },
  {
    id: 6, category: "subsidy", badge: "New", important: true,
    title: "PMKSY-PDMC — 55% Drip Irrigation Subsidy",
    body: "Under PM Krishi Sinchai Yojana Per Drop More Crop (PDMC), small and marginal farmers in West Bengal and Bihar receive 55% subsidy on drip irrigation systems; other farmers get 45%. Applications accepted at District Agriculture Offices. Installation must be completed within 3 months of approval.",
    date: "Mar 22, 2025", link: "https://pmksy.gov.in", linkLabel: "Apply Now",
    tags: ["Irrigation", "West Bengal", "Bihar"],
  },
  {
    id: 7, category: "subsidy", badge: "Expiring", important: true,
    title: "PKVY Organic Farming — ₹50,000/ha, Register by Apr 15",
    body: "Paramparagat Krishi Vikas Yojana (PKVY) provides ₹50,000 per hectare for cluster-based organic farming over 3 years. Eastern India clusters are forming now. Deadline to register your farmer group is April 15, 2025. A minimum of 20 farmers are required per cluster. Contact Block Agriculture Officer.",
    date: "Mar 8, 2025", link: "https://pgsindia-ncof.gov.in", linkLabel: "Register Cluster",
    tags: ["Organic", "Eastern India"],
  },
  {
    id: 8, category: "subsidy", badge: "", important: false,
    title: "Soil Health Card — Free Testing & Fertiliser Subsidy",
    body: "All farmers can get soil tested free of cost and receive a Soil Health Card with district-specific fertiliser recommendations. Following SHC recommendations qualifies farmers for an additional 10% subsidy on recommended fertilisers. Visit your nearest KVK or Soil Testing Laboratory.",
    date: "Mar 19, 2025", link: "https://soilhealth.dac.gov.in", linkLabel: "Find Nearest Lab",
    tags: ["Soil", "All States"],
  },
  {
    id: 9, category: "subsidy", badge: "", important: false,
    title: "RKVY-RAFTAAR — Farm Machinery Subsidy (25–60%)",
    body: "Rashtriya Krishi Vikas Yojana provides subsidy on farm machinery including power tillers (25–50% subsidy), harvesters, and seeders. West Bengal farmers apply via the state agriculture department portal. SC/ST farmers receive priority consideration (up to 60% subsidy on select equipment).",
    date: "Mar 12, 2025", link: "https://rkvy.nic.in", linkLabel: "State Portal",
    tags: ["Machinery", "West Bengal"],
  },
  {
    id: 10, category: "weather", badge: "Alert", important: true,
    title: "IMD Alert: Pre-Monsoon Heatwave — West Bengal & Odisha",
    body: "India Meteorological Department has issued a heatwave warning for West Bengal, Odisha and Bihar for March 25–30. Maximum temperatures expected to reach 40–43°C. Farmers are advised to irrigate fields in the early morning, avoid field work between 11am–4pm, and ensure adequate water and shade for livestock.",
    date: "Mar 23, 2025", link: "https://mausam.imd.gov.in", linkLabel: "IMD Forecast",
    tags: ["West Bengal", "Odisha", "Bihar"],
  },
  {
    id: 11, category: "weather", badge: "", important: false,
    title: "Monsoon 2025 Forecast — Above-Normal Rainfall Expected",
    body: "IMD's Long Range Forecast for Southwest Monsoon 2025 predicts above-normal rainfall (106% of LPA) for Eastern India. Farmers should prepare for early sowing of Kharif crops, particularly paddy. Waterlogging management infrastructure should be checked and repaired before June.",
    date: "Mar 20, 2025", link: "https://imd.gov.in", linkLabel: "Full Report",
    tags: ["Kharif Planning", "Eastern India"],
  },
  {
    id: 12, category: "weather", badge: "", important: false,
    title: "Late Blight Risk — Potato in West Bengal & Bihar",
    body: "Favourable conditions for late blight (Phytophthora infestans) are forecast for potato growing regions in the next 15 days. Farmers are advised to apply Mancozeb 75% WP @ 2.5g/litre or Metalaxyl 8% + Mancozeb 64% WP @ 2g/litre prophylactically. Contact your local KVK for guidance.",
    date: "Mar 16, 2025", link: "https://nhb.gov.in", linkLabel: "KVK Helpline",
    tags: ["Potato", "West Bengal", "Bihar"],
  },
  {
    id: 13, category: "market", badge: "New", important: true,
    title: "Paddy MSP Hiked to ₹2,300/quintal — Kharif 2025",
    body: "Cabinet Committee on Economic Affairs (CCEA) has approved a Minimum Support Price of ₹2,300 per quintal for Common grade paddy and ₹2,320 for Grade A paddy for Kharif Marketing Season 2025-26. This is ₹117 higher than the previous year. Procurement through FCI and state agencies.",
    date: "Mar 21, 2025", link: "https://fci.gov.in", linkLabel: "MSP Schedule",
    tags: ["Rice", "Eastern India"],
  },
  {
    id: 14, category: "market", badge: "", important: false,
    title: "Jute Prices Surge — ₹6,800/quintal on MCX",
    body: "Raw jute prices have surged 12% in March 2025, driven by strong export demand from Bangladesh and domestic jute mill procurement. Farmers with stored stocks may benefit from holding 2–4 more weeks. West Bengal Jute Board procurement centres are active in all major districts.",
    date: "Mar 17, 2025", link: "https://jci.gov.in", linkLabel: "Jute Board Prices",
    tags: ["Jute", "West Bengal"],
  },
  {
    id: 15, category: "market", badge: "", important: false,
    title: "Potato Prices Firm at ₹1,200–1,400/quintal",
    body: "Potato arrivals from West Bengal have moderated, supporting prices in the ₹1,200–1,400/quintal range at Burdwan and Cooch Behar mandis. Cold storage utilisation is 72%. Farmers storing potato should consider forward contracts to lock in current prices ahead of new season arrivals.",
    date: "Mar 14, 2025", link: "https://agmarknet.gov.in", linkLabel: "Live Market Prices",
    tags: ["Potato", "West Bengal"],
  },
  {
    id: 16, category: "advisory", badge: "", important: false,
    title: "Kharif 2025 — Recommended Crop Varieties (ICAR)",
    body: "ICAR-CRRI recommendations for Kharif 2025: MTU-7029 (Swarna) and Lalat for lowland paddy; Ajay and NDR-97 for medium land paddy. For jute, JRO-524 and JRO-8432 are recommended for highest yields. Seeds available through WBSSC and District Cooperative Societies.",
    date: "Mar 11, 2025", link: "https://icar.org.in", linkLabel: "Full Variety List",
    tags: ["Seeds", "Kharif 2025"],
  },
  {
    id: 17, category: "advisory", badge: "", important: false,
    title: "Stem Borer Alert — Paddy Nurseries in Midnapore & Burdwan",
    body: "Early instar larvae of stem borer (Scirpophaga incertulas) detected in paddy nurseries in Midnapore and Burdwan. Recommended: Release Trichogramma japonicum egg parasitoid cards @ 5 cards/ha at 7-day intervals. Chemical: Cartap Hydrochloride 4G @ 18 kg/ha if economic threshold is crossed.",
    date: "Mar 9, 2025", link: "https://nhm.nic.in", linkLabel: "IPM Guidelines",
    tags: ["Paddy", "West Bengal"],
  },
  {
    id: 18, category: "advisory", badge: "", important: false,
    title: "Free Soil Health Card Camp — April 2025, All Blocks",
    body: "West Bengal Department of Agriculture is conducting a free Soil Health Card camp across all blocks in April 2025. Farmers can get NPK and micronutrient analysis done free of cost. Cards provide crop-specific fertiliser recommendations. Contact your Block Agriculture Officer or nearest KVK.",
    date: "Mar 22, 2025", link: "https://soilhealth.dac.gov.in", linkLabel: "Find Testing Centre",
    tags: ["Soil Health", "West Bengal"],
  },
];

const catColor = {
  scheme:   "from-green-500 to-emerald-600",
  subsidy:  "from-yellow-500 to-amber-600",
  weather:  "from-blue-500 to-cyan-600",
  market:   "from-teal-500 to-green-600",
  advisory: "from-emerald-500 to-green-700",
};

const badgeStyle = {
  New:      "bg-green-500/15 text-green-400 border-green-500/25",
  Alert:    "bg-red-500/15 text-red-400 border-red-500/25",
  Open:     "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Expiring: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
};

function NotifCard({ n, expanded, setExpanded, i }) {
  const isOpen = expanded === n.id;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.04 }}
      className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isOpen ? "border-green-500/35 bg-white/5" : "border-white/8 bg-white/3 hover:border-green-500/20 hover:bg-white/4"
      }`}
      onClick={() => setExpanded(isOpen ? null : n.id)}
    >
      {n.important && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${catColor[n.category] || "from-green-500 to-emerald-600"}`} />
      )}
      <div className={`${n.important ? "pl-4" : ""} px-5 py-4 flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${catColor[n.category] || "from-green-500 to-emerald-600"} shrink-0 shadow-lg`}>
            <span className="text-base">{CATEGORIES.find(c => c.id === n.category)?.icon || "📋"}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-black text-sm tracking-wide transition-colors ${isOpen ? "text-green-400" : "text-white/85 group-hover:text-white"}`}>
                {n.title}
              </h3>
              {n.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border ${badgeStyle[n.badge] || ""}`}>
                  {n.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <p className="text-gray-500 text-xs">{n.date}</p>
              {n.tags.slice(0, 2).map(t => (
                <span key={t} className="text-[0.58rem] px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-gray-500 font-bold uppercase tracking-wider">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 transition-all ${
            isOpen ? "bg-green-500/15 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-white/40"
          }`}>
          <ChevronDown size={13} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 pl-16">
              <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-3" />
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{n.body}</p>
              <div className="flex flex-wrap items-center gap-3">
                {n.link && (
                  <a href={n.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-wide hover:bg-green-500/25 transition-all duration-200">
                    {n.linkLabel || "Learn More"} <ExternalLink size={11} />
                  </a>
                )}
                {n.tags.map(t => (
                  <span key={t} className="text-[0.65rem] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-wider">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [active, setActive]     = useState("all");
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState(null);
  const [email, setEmail]       = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  const filtered = NOTIFICATIONS.filter(n => {
    const matchCat    = active === "all" || n.category === active;
    const q           = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const important = filtered.filter(n => n.important);
  const regular   = filtered.filter(n => !n.important);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubSuccess(true); setEmail(""); }
  };

  return (
    <div className="min-h-screen bg-[#020805]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pt-24">

        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <Bell size={11} className="text-green-400" />
              <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Live Govt. Schemes & Alerts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Farmer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                Notifications
              </span>{" "}
              Hub
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Government schemes, subsidies, weather alerts and market intelligence — curated for Eastern India farmers. Never miss a benefit you deserve.
            </p>
          </motion.div>
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { emoji: "🏛️", label: "5 Active Schemes" },
            { emoji: "💰", label: "3 Open Subsidies" },
            { emoji: "⚠️", label: "2 Urgent Alerts" },
            { emoji: "📈", label: "Live MSP Updates" },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/10 text-gray-300 text-xs font-bold">
              <span>{emoji}</span> {label}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xl mx-auto">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search schemes, subsidies, crops, districts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/40 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                active === c.id
                  ? "bg-green-500/15 border-green-500/40 text-green-400"
                  : "bg-white/3 border-white/8 text-gray-400 hover:border-green-500/25 hover:text-gray-300"
              }`}>
              <span>{c.icon}</span> {c.label}
              <span className="ml-1 text-[0.6rem] opacity-50">
                ({c.id === "all" ? NOTIFICATIONS.length : NOTIFICATIONS.filter(n => n.category === c.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Important alerts */}
        {important.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={13} className="text-yellow-400" />
              <span className="text-[0.7rem] font-black tracking-[0.15em] uppercase text-yellow-400">Priority Alerts & Deadlines</span>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
            </div>
            <div className="space-y-3">
              {important.map((n, i) => <NotifCard key={n.id} n={n} expanded={expanded} setExpanded={setExpanded} i={i} />)}
            </div>
          </div>
        )}

        {/* Regular notifications */}
        {regular.length > 0 && (
          <div className="mb-8">
            {important.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Bell size={13} className="text-gray-400" />
                <span className="text-[0.7rem] font-black tracking-[0.15em] uppercase text-gray-400">All Updates</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>
            )}
            <div className="space-y-3">
              {regular.map((n, i) => <NotifCard key={n.id} n={n} expanded={expanded} setExpanded={setExpanded} i={i} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold">No notifications found</p>
            <p className="text-sm mt-1">Try a different category or search term</p>
          </div>
        )}

        {/* Subscribe Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/20 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={16} className="text-green-400" />
                <span className="text-[0.7rem] font-black tracking-[0.15em] uppercase text-green-400">Stay Updated</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">Get Scheme Alerts on WhatsApp & Email</h3>
              <p className="text-gray-400 text-sm">Never miss a PM-KISAN installment, subsidy deadline, or weather alert. Free, zero spam.</p>
            </div>
            <div className="w-full sm:w-auto">
              {subSuccess ? (
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-bold">
                  <Check size={16} /> Subscribed! We'll notify you.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/40 min-w-0 w-44" />
                  <button type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-black tracking-wide uppercase shadow-[0_0_14px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 transition-all shrink-0">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Official portals quick links */}
          <div className="mt-6 pt-5 border-t border-white/8">
            <p className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-gray-500 mb-3">Official Govt. Portals</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "PM-KISAN",         url: "https://pmkisan.gov.in" },
                { label: "PMFBY",            url: "https://pmfby.gov.in" },
                { label: "e-NAM",            url: "https://enam.gov.in" },
                { label: "Agmarknet",        url: "https://agmarknet.gov.in" },
                { label: "IMD Forecast",     url: "https://mausam.imd.gov.in" },
                { label: "Soil Health Card", url: "https://soilhealth.dac.gov.in" },
                { label: "NABARD",           url: "https://nabard.org" },
                { label: "ICAR",             url: "https://icar.org.in" },
                { label: "PKVY Organic",     url: "https://pgsindia-ncof.gov.in" },
                { label: "Jute Corp India",  url: "https://jci.gov.in" },
              ].map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[0.72rem] font-bold hover:border-green-500/30 hover:text-green-400 transition-all duration-200">
                  {label} <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
