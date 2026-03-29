import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../api/auth";
import { LayoutDashboard, Users, ShoppingBag, Bell, LogOut, Menu, X, TrendingUp, Plus, Leaf } from "lucide-react";

const NAV = [
  { id:"overview",      label:"Overview",      icon:LayoutDashboard },
  { id:"users",         label:"Users",         icon:Users },
  { id:"marketplace",   label:"Marketplace",   icon:ShoppingBag },
  { id:"notifications", label:"Notifications", icon:Bell },
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

const EMPTY_PRODUCT = { name:"", category:"crops", price:"", unit:"kg", qty:"", state:"", badge:"", image:"" };
const CATS_OPTIONS  = ["crops","seeds","fertilisers","equipment","pesticides"];
const BADGE_OPTIONS = ["","Organic","Fresh","Premium","Certified","Govt. Rate"];

const inputCls = "w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-all";

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const user      = getUser();
  const [active, setActive]     = useState("overview");
  const [sidebar, setSidebar]   = useState(true);

  // ── Overview state ─────────────────────────────────────────────
  const [stats, setStats]       = useState([]);
  const [activity, setActivity] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Users state ────────────────────────────────────────────────
  const [users, setUsers]       = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // ── Marketplace state ──────────────────────────────────────────
  const [products, setProducts]         = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [formData, setFormData]         = useState(EMPTY_PRODUCT);
  const [formError, setFormError]       = useState("");
  const [formLoading, setFormLoading]   = useState(false);
  const [deleteId, setDeleteId]         = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, []);

  // Fetch stats
  useEffect(() => {
    if (active !== "overview") return;
    setStatsLoading(true);
    fetch("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(r => r.json())
      .then(data => {
        setStats(data.stats   || []);
        setActivity(data.activity || []);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [active]);

  // Fetch users
  useEffect(() => {
    if (active !== "users") return;
    setUsersLoading(true);
    fetch("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(r => r.json())
.then(data => {
  const list = data.users ?? data.data ?? data;
  setUsers(Array.isArray(list) ? list : []);
})      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [active]);

  // Fetch products
  useEffect(() => {
    if (active !== "marketplace") return;
    setProductsLoading(true);
    fetch("http://localhost:5000/api/products", { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(r => r.json())
      .then(data => setProducts(data || []))
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, [active]);

  const handleLogout = () => { logoutUser(); navigate("/"); };

  const handleFormChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name.trim())  return setFormError("Product name is required.");
    if (!formData.price)        return setFormError("Price is required.");
    if (!formData.qty)          return setFormError("Available quantity is required.");
    if (!formData.state.trim()) return setFormError("State/location is required.");
    setFormLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ ...formData, price: Number(formData.price), qty: Number(formData.qty) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product.");
      setProducts(p => [data, ...p]);
      setFormData(EMPTY_PRODUCT);
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setDeleteId(id);
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setProducts(p => p.filter(pr => pr._id !== id));
    } catch {}
    finally { setDeleteId(null); }
  };

  const fmtPrice = (p) => `₹${Number(p).toLocaleString("en-IN")}`;

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

          {/* ── OVERVIEW ── */}
          {active === "overview" && (
            <div>
              {statsLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5 animate-pulse h-28" />
                  ))}
                </div>
              ) : stats.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map(s => <StatCard key={s.label} {...s} />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label:"Total Users",     value:"—", delta:"—", color:"from-green-500 to-emerald-600",  glow:"rgba(0,166,81,0.3)" },
                    { label:"Predictions",     value:"—", delta:"—", color:"from-emerald-600 to-green-700",  glow:"rgba(5,150,105,0.3)" },
                    { label:"Listings",        value:"—", delta:"—", color:"from-teal-500 to-green-600",     glow:"rgba(20,184,166,0.3)" },
                    { label:"Avg Yield (t/ha)",value:"—", delta:"—", color:"from-green-400 to-teal-500",     glow:"rgba(0,166,81,0.3)" },
                  ].map(s => <StatCard key={s.label} {...s} />)}
                </div>
              )}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-green-400" />
                  <h3 className="text-white font-black text-sm uppercase tracking-wide">Recent Activity</h3>
                </div>
                <div className="h-px bg-gradient-to-r from-green-500/20 to-transparent mb-4" />
                {activity.length > 0 ? (
                  <ul className="space-y-2">
                    {activity.map((a, i) => (
                      <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {a.message} <span className="ml-auto text-gray-600 text-xs">{a.time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">Activity log will appear here as farmers use the platform.</p>
                )}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {active === "users" && (
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-white/6">
                <Users size={16} className="text-green-400" />
                <h3 className="text-white font-black text-sm uppercase tracking-wide">Registered Users</h3>
              </div>
              {usersLoading ? (
                <div className="p-8 text-center text-gray-500 text-sm animate-pulse">Loading users…</div>
              ) : (
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
                      {users.length === 0 ? (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500 text-sm">No users found.</td></tr>
                      ) : users.map((u, i) => (
                        <tr key={u._id || u.id} className={`border-b border-white/4 last:border-none ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-green-500/4 transition-colors`}>
                          <td className="px-5 py-3 text-white text-sm font-bold">{u.name}</td>
                          <td className="px-5 py-3 text-gray-400 text-sm">{u.email}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border ${
                              u.role === "farmer" ? "bg-green-500/15 text-green-400 border-green-500/25" :
                              u.role === "admin"  ? "bg-purple-500/15 text-purple-400 border-purple-500/25" :
                                                   "bg-blue-500/15 text-blue-400 border-blue-500/25"
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-sm">{u.joined || new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
                          <td className="px-5 py-3 text-green-400 font-bold text-sm">{u.predictions ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── MARKETPLACE ── */}
          {active === "marketplace" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-green-400" />
                  <h3 className="text-white font-black text-sm uppercase tracking-wide">Marketplace Products</h3>
                </div>
                <button onClick={() => { setShowForm(p => !p); setFormError(""); setFormData(EMPTY_PRODUCT); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-xs uppercase tracking-wide shadow-[0_0_12px_rgba(0,166,81,0.3)] hover:shadow-[0_0_20px_rgba(0,166,81,0.5)] transition-all">
                  <Plus size={13} /> {showForm ? "Cancel" : "Add Product"}
                </button>
              </div>

              {/* Create product form */}
              {showForm && (
                <div className="mb-6 bg-white/3 border border-green-500/20 rounded-2xl p-5">
                  <h4 className="text-white font-black text-sm uppercase tracking-wide mb-4">New Product</h4>
                  {formError && <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">⚠️ {formError}</div>}
                  <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Product Name *</label>
                      <input name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. Basmati Rice" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Category *</label>
                      <select name="category" value={formData.category} onChange={handleFormChange}
                        className={`${inputCls} appearance-none cursor-pointer`} style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}>
                        {CATS_OPTIONS.map(c => <option key={c} value={c} style={{ background:"#0a1a10" }}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Price (₹) *</label>
                      <input name="price" type="number" min="0" value={formData.price} onChange={handleFormChange} placeholder="e.g. 2500" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Unit</label>
                      <input name="unit" value={formData.unit} onChange={handleFormChange} placeholder="kg / quintal / litre" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Available Qty *</label>
                      <input name="qty" type="number" min="0" value={formData.qty} onChange={handleFormChange} placeholder="e.g. 500" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">State / Location *</label>
                      <input name="state" value={formData.state} onChange={handleFormChange} placeholder="e.g. West Bengal" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Badge</label>
                      <select name="badge" value={formData.badge} onChange={handleFormChange}
                        className={`${inputCls} appearance-none cursor-pointer`} style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}>
                        {BADGE_OPTIONS.map(b => <option key={b} value={b} style={{ background:"#0a1a10" }}>{b || "None"}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1">Image URL</label>
                      <input name="image" value={formData.image} onChange={handleFormChange} placeholder="https://…" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
                      <button type="button" onClick={() => { setShowForm(false); setFormData(EMPTY_PRODUCT); setFormError(""); }}
                        className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-xs font-black uppercase hover:border-white/25 hover:text-white transition-all">
                        Cancel
                      </button>
                      <button type="submit" disabled={formLoading}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-xs uppercase tracking-wide shadow-[0_0_12px_rgba(0,166,81,0.3)] hover:shadow-[0_0_20px_rgba(0,166,81,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {formLoading ? "Creating…" : "Create Product"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products table */}
              <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                {productsLoading ? (
                  <div className="p-8 text-center text-gray-500 text-sm animate-pulse">Loading products…</div>
                ) : products.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No products listed yet. Add one above.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/6">
                          {["Product","Category","Price","Qty","State","Badge","Actions"].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-[0.7rem] font-black uppercase tracking-widest text-gray-500">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, i) => (
                          <tr key={p._id} className={`border-b border-white/4 last:border-none ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-green-500/4 transition-colors`}>
                            <td className="px-5 py-3 text-white text-sm font-bold">{p.name}</td>
                            <td className="px-5 py-3 text-gray-400 text-sm capitalize">{p.category}</td>
                            <td className="px-5 py-3 text-green-400 font-bold text-sm">{fmtPrice(p.price)}/{p.unit}</td>
                            <td className="px-5 py-3 text-gray-400 text-sm">{p.qty}</td>
                            <td className="px-5 py-3 text-gray-400 text-sm">{p.state}</td>
                            <td className="px-5 py-3">
                              {p.badge
                                ? <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border bg-green-500/15 text-green-400 border-green-500/25">{p.badge}</span>
                                : <span className="text-gray-600 text-xs">—</span>}
                            </td>
                            <td className="px-5 py-3">
                              <button onClick={() => handleDeleteProduct(p._id)} disabled={deleteId === p._id}
                                className="px-3 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-wider border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                {deleteId === p._id ? "…" : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {active === "notifications" && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-white font-black text-lg mb-2 uppercase">Notification Management</h3>
              <p className="text-gray-500 text-sm">This section is under development and will be available soon.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}