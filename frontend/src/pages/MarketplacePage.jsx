import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getUser } from "../api/auth";
import { ShoppingBag, Plus, Search, Star, X } from "lucide-react";
import PayPalCheckout from "../components/PayPalCheckout";

const CATS = [
  { id:"all",         label:"All Products"  },
  { id:"crops",       label:"Crops"         },
  { id:"seeds",       label:"Seeds"         },
  { id:"fertilisers", label:"Fertilisers"   },
  { id:"equipment",   label:"Equipment"     },
  { id:"pesticides",  label:"Pesticides"    },
];

const badgeColor = { Organic:"rgba(0,166,81,0.2)", Fresh:"rgba(20,184,166,0.2)", Premium:"rgba(139,92,246,0.2)", Certified:"rgba(59,130,246,0.2)", "Govt. Rate":"rgba(245,158,11,0.2)" };
const badgeText  = { Organic:"#4ade80", Fresh:"#2dd4bf", Premium:"#a78bfa", Certified:"#60a5fa", "Govt. Rate":"#fbbf24" };
const fmtPrice   = (p) => `₹${p.toLocaleString("en-IN")}`;

function ProductCard({ item, onCart, inCart }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="group relative bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-green-500/30 hover:bg-white/5 transition-all duration-300">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,166,81,0.12) 0%, transparent 70%)" }} />
      <div className="relative h-40 overflow-hidden">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {item.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border"
            style={{ background: badgeColor[item.badge] || "rgba(0,166,81,0.2)", color: badgeText[item.badge] || "#4ade80", borderColor: (badgeText[item.badge] || "#4ade80") + "40" }}>
            {item.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-black text-sm tracking-wide mb-0.5 truncate">{item.name}</h3>
        <p className="text-gray-500 text-[0.7rem] mb-2 truncate">{item.seller}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 text-[0.7rem] font-bold">{item.rating}</span>
          <span className="text-gray-600 text-[0.65rem]">({item.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-400 font-black text-base">{fmtPrice(item.price)}</span>
            <span className="text-gray-500 text-[0.7rem]">/{item.unit}</span>
          </div>
          <button onClick={() => onCart(item)}
            className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-black uppercase tracking-wider transition-all duration-200 ${
              inCart
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-[0_0_10px_rgba(0,166,81,0.3)] hover:shadow-[0_0_16px_rgba(0,166,81,0.5)]"
            }`}>
            {inCart ? "Added ✓" : "Add"}
          </button>
        </div>
        <p className="text-gray-600 text-[0.65rem] mt-1">Available: {item.qty} · {item.state}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
    </motion.div>
  );
}

export default function MarketplacePage() {
  const user = getUser();
  const [products, setProducts]         = useState([]);
  const [cat, setCat]                   = useState("all");
  const [search, setSearch]             = useState("");
  const [cart, setCart]                 = useState([]);
  const [showCart, setShowCart]         = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const filtered = products.filter(l =>
    (cat === "all" || l.category === cat) &&
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCart = (item) => setCart(p => p.some(c => c._id === item._id) ? p.filter(c => c._id !== item._id) : [...p, item]);

  const handleOrderComplete = async ({ transactionId }) => {
    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        totalAmount: cart.reduce((a, c) => a + c.price, 0),
        paymentId: transactionId,
      }),
    });
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-[#020805]">
      <Header />
      <main>
        {/* Hero banner */}
        <div className="relative bg-gradient-to-r from-[#001a0d] to-[#020805] border-b border-green-900/20 px-4 sm:px-6 py-8 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 24px)" }} />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-64 bg-green-600/8 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-3">
                <ShoppingBag size={11} className="text-green-400" />
                <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Direct Farmer Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Agri <span className="text-green-400">Marketplace</span></h1>
              <p className="text-gray-400 text-sm">Buy direct from farmers. No middlemen. Best prices.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCart(p => !p)} className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm hover:border-green-500/30 transition-all">
                Cart
                {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 text-black text-[0.6rem] font-black flex items-center justify-center">{cart.length}</span>}
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm text-white transition-all duration-200 bg-[#0070ba] hover:bg-[#005ea6] shadow-[0_4px_16px_rgba(0,112,186,0.4)]"
                >
                  <span><span className="text-[#9ecfed]">Pay</span>Pal</span> · {cart.length} item{cart.length > 1 ? "s" : ""}
                </button>
              )}
              {user && (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm shadow-[0_0_14px_rgba(0,166,81,0.3)] hover:shadow-[0_0_22px_rgba(0,166,81,0.5)] transition-all">
                  <Plus size={14} /> List Product
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Cart drawer */}
          {showCart && cart.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white/3 border border-green-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-black text-sm uppercase tracking-wide">Your Cart ({cart.length})</h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-bold text-sm">{fmtPrice(item.price)}/{item.unit}</span>
                      <button onClick={() => toggleCart(item)} className="text-gray-600 hover:text-red-400 transition-colors"><X size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,112,186,0.35)]">
                <span className="font-black"><span className="text-[#009cde]">Pay</span><span className="text-white">Pal</span></span>
                Checkout
              </button>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500/50 focus:shadow-[0_0_0_3px_rgba(0,166,81,0.12)] transition-all" />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[0.75rem] font-bold uppercase tracking-wide transition-all duration-200 ${
                    cat === c.id ? "bg-green-500/15 border-green-500/40 text-green-400" : "bg-white/3 border-white/8 text-gray-400 hover:border-green-500/25 hover:text-gray-300"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <ProductCard key={item._id} item={item} onCart={toggleCart} inCart={cart.some(c => c._id === item._id)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">No products found for "{search}"</div>
          )}
        </div>
      </main>
      <Footer />
      {showCheckout && cart.length > 0 && (
        <PayPalCheckout
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onComplete={handleOrderComplete}
        />
      )}
    </div>
  );
}