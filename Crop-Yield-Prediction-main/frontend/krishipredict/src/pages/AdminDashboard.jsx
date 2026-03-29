import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../api/auth";
import { LayoutDashboard, Users, ShoppingBag, Bell, LogOut, Menu, X, TrendingUp, BarChart2, Leaf } from "lucide-react";

const NAV = [
  { id:"overview",      label:"Overview",      icon:LayoutDashboard },
  { id:"users",         label:"Users",         icon:Users },
  { id:"marketplace",   label:"Marketplace",   icon:ShoppingBag },
  { id:"notifications", label:"Notifications", icon:Bell },
];

const MOCK_STATS = [
  { label:"Total Users",    value:"1,248",  delta:"+12%", color:"from-green-500 to-emerald-600", glow:"rgba(0,166,81,0.3)" },
  { label:"Predictions",    value:"8,904",  delta:"+24%", color:"from-emerald-600 to-green-700", glow:"rgba(5,150,105,0.3)" },
  { label:"Listings",       value:"342",    delta:"+8%",  color:"from-teal-500 to-green-600",    glow:"rgba(20,184,166,0.3)" },
  { label:"Avg Yield (t/ha)",value:"2.74", delta:"+3%",  color:"from-green-400 to-teal-500",    glow:"rgba(0,166,81,0.3)" },
];

const MOCK_USERS = [
  { id:1, name:"Ramesh Mondal",   email:"ramesh@example.com",   role:"farmer", joined:"Nov 1, 2024",  predictions:14 },
  { id:2, name:"Priya Singh",     email:"priya@example.com",    role:"seller", joined:"Oct 28, 2024", predictions:0  },
  { id:3, name:"Ayush Das",      email:"ayush@example.com",   role:"farmer", joined:"Oct 20, 2024", predictions:7  },
  { id:4, name:"Sunita Devi",     email:"sunita@example.com",   role:"farmer", joined:"Oct 15, 2024", predictions:22 },
  { id:5, name:"Manoj Sharma",    email:"manoj@example.com",    role:"seller", joined:"Oct 10, 2024", predictions:0  },
];

function StatCard({ label, value, delta, color, glow }) {
  return (
    <div className="group relative bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-green-500/30 hover:bg-white/5 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }} />
      <p className="text-gray-500 text-[0.7rem] font-bold uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${color} mb-1`}>{value}</p>
      <span className="text-green-400 text-xs font-bold">{delta} this month</span>
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
    </div>
  );
}

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const user      = getUser();
  const [active, setActive]   = useState("overview");
  const [sidebar, setSidebar] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, []);

  const handleLogout = () => { logoutUser(); navigate("/"); };

  return (
    <div className="min-h-screen bg-[#020805] flex">
      {/* Sidebar */}
      <aside className={`${sidebar ? "w-60" : "w-16"} shrink-0 transition-all duration-300 bg-[#030f06] border-r border-green-900/20 flex flex-col relative`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-green-900/15">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-700 shadow-[0_0_14px_rgba(0,166,81,0.4)] shrink-0">
            <Leaf size={18} color="white" strokeWidth={2.2} />
          </div>
          {sidebar && <span className="text-white font-black text-lg leading-none">Krishi<span className="text-green-400">Predict</span></span>}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                active === id ? "bg-green-500/15 text-green-400 border border-green-500/30" : "text-gray-400 hover:bg-white/4 hover:text-white"
              }`}>
              <Icon size={16} strokeWidth={2} className="shrink-0" />
              {sidebar && <span className="text-[0.82rem] font-bold tracking-wide uppercase">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="px-2 pb-4">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-500/8 hover:text-red-400 hover:border hover:border-red-500/20 transition-all duration-200">
            <LogOut size={16} className="shrink-0" />
            {sidebar && <span className="text-[0.82rem] font-bold tracking-wide uppercase">Logout</span>}
          </button>
        </div>

        <button onClick={() => setSidebar(p => !p)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#030f06] border border-green-900/30 flex items-center justify-center text-gray-500 hover:text-green-400 transition-colors">
          {sidebar ? <X size={11} /> : <Menu size={11} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-green-900/15 bg-[#020805]/80 backdrop-blur flex items-center justify-between px-6">
          <h2 className="text-white font-black text-base uppercase tracking-wide">{NAV.find(n => n.id === active)?.label}</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 font-black text-xs uppercase">
              {user?.name?.[0] || "A"}
            </div>
            <span className="hidden sm:inline">{user?.name || "Admin"}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {active === "overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {MOCK_STATS.map(s => <StatCard key={s.label} {...s} />)}
              </div>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-green-400" />
                  <h3 className="text-white font-black text-sm uppercase tracking-wide">Recent Activity</h3>
                </div>
                <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-4" />
                <p className="text-gray-500 text-sm">Activity log will appear here as farmers use the platform.</p>
              </div>
            </div>
          )}

          {active === "users" && (
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-white/6">
                <Users size={16} className="text-green-400" />
                <h3 className="text-white font-black text-sm uppercase tracking-wide">Registered Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/6">
                      {["Name","Email","Role","Joined","Predictions"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-[0.7rem] font-black uppercase tracking-widest text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((u, i) => (
                      <tr key={u.id} className={`border-b border-white/4 last:border-none ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-green-500/4 transition-colors`}>
                        <td className="px-5 py-3 text-white text-sm font-bold">{u.name}</td>
                        <td className="px-5 py-3 text-gray-400 text-sm">{u.email}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border ${
                            u.role === "farmer" ? "bg-green-500/15 text-green-400 border-green-500/25" : "bg-blue-500/15 text-blue-400 border-blue-500/25"
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-sm">{u.joined}</td>
                        <td className="px-5 py-3 text-green-400 font-bold text-sm">{u.predictions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(active === "marketplace" || active === "notifications") && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">{active === "marketplace" ? "🛒" : "🔔"}</div>
              <h3 className="text-white font-black text-lg mb-2 uppercase">{active === "marketplace" ? "Marketplace Management" : "Notification Management"}</h3>
              <p className="text-gray-500 text-sm">This section is under development and will be available soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
