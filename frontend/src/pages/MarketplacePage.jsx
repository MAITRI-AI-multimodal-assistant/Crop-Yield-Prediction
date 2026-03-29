import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getUser } from "../api/auth";
import { ShoppingBag, Plus, Search, Star, X, Leaf, Sprout, Package, ChevronLeft, ChevronRight } from "lucide-react";
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
const fmtPrice   = (p) => `₹${Number(p).toLocaleString("en-IN")}`;

const CAT_EMOJI = { crops:"🌾", seeds:"🌱", fertilisers:"🧪", equipment:"🚜", pesticides:"🛡️" };
const PAGE_SIZE = 10;

function ImagePlaceholder({ name, category }) {
  const emoji = CAT_EMOJI[category] || "📦";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-900/40 to-emerald-900/20 gap-2">
      <span className="text-4xl">{emoji}</span>
      <span className="text-green-600 text-[0.6rem] font-bold uppercase tracking-widest px-2 text-center truncate w-full text-center">{name}</span>
    </div>
  );
}

function ProductCard({ item, onCart, inCart }) {
  const [imgErr, setImgErr] = useState(false);
  const imgSrc = item.image || item.img;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group relative bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/40 hover:shadow-[0_0_32px_rgba(0,166,81,0.12)] transition-all duration-300 flex flex-col"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,166,81,0.1) 0%, transparent 65%)" }} />

      <div className="relative h-44 overflow-hidden bg-[#041a0a] shrink-0">
        {imgSrc && !imgErr ? (
          <img src={imgSrc} alt={item.name} onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <ImagePlaceholder name={item.name} category={item.category} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {item.badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[0.58rem] font-black uppercase tracking-wider border backdrop-blur-sm"
            style={{ background: badgeColor[item.badge] || "rgba(0,166,81,0.2)", color: badgeText[item.badge] || "#4ade80", borderColor: (badgeText[item.badge] || "#4ade80") + "50" }}>
            {item.badge}
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[0.58rem] font-bold uppercase tracking-wider bg-black/50 border border-white/10 text-gray-300 backdrop-blur-sm capitalize">
          {item.category || "product"}
        </span>
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-end justify-between">
          <div>
            <span className="text-green-400 font-black text-lg drop-shadow-lg">{fmtPrice(item.price)}</span>
            <span className="text-gray-300 text-[0.68rem] ml-0.5 drop-shadow">/{item.unit || "unit"}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="text-white font-black text-sm tracking-wide leading-tight truncate">{item.name}</h3>
          {item.seller && (
            <p className="text-gray-500 text-[0.68rem] mt-0.5 truncate flex items-center gap-1">
              <Leaf size={9} className="text-green-600 shrink-0" /> {item.seller}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9}
              className={i < Math.round(item.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-700 fill-gray-700"} />
          ))}
          {item.reviews > 0 && <span className="text-gray-600 text-[0.62rem] ml-1">({item.reviews})</span>}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-gray-600 text-[0.62rem]">
            <Package size={9} className="text-gray-600" />
            <span>{item.qty ? `${item.qty} avail.` : "In stock"}</span>
            {item.state && <span className="text-gray-700">· {item.state}</span>}
          </div>
          <button onClick={() => onCart(item)}
            className={`px-3.5 py-1.5 rounded-lg text-[0.68rem] font-black uppercase tracking-wider transition-all duration-200 ${
              inCart
                ? "bg-green-500/20 border border-green-500/40 text-green-400 shadow-[0_0_10px_rgba(0,166,81,0.2)]"
                : "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-[0_0_10px_rgba(0,166,81,0.25)] hover:shadow-[0_0_18px_rgba(0,166,81,0.5)] hover:-translate-y-px"
            }`}>
            {inCart ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Reset to page 1 whenever filter/search changes
  useEffect(() => { setPage(1); }, [cat, search]);

  const filtered   = products.filter(l =>
    (cat === "all" || l.category === cat) &&
    l.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <div className="relative bg-gradient-to-r from-[#001a0d] to-[#020805] border-b border-green-900/20 px-4 sm:px-6 py-10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 24px)" }} />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-64 bg-green-600/8 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-3">
                <ShoppingBag size={11} className="text-green-400" />
                <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-green-400">Direct Farmer Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Agri <span className="text-green-400">Marketplace</span></h1>
              <p className="text-gray-400 text-sm">Buy direct from farmers · No middlemen · Best prices</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {["🌾 Farm Fresh","✅ Verified Sellers","💰 Zero Commission","🚚 Direct Delivery"].map(t => (
                  <span key={t} className="text-[0.62rem] text-gray-500 font-semibold">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCart(p => !p)} className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm hover:border-green-500/30 transition-all">
                🛒 Cart
                {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 text-black text-[0.6rem] font-black flex items-center justify-center">{cart.length}</span>}
              </button>
              {cart.length > 0 && (
                <button onClick={() => setShowCheckout(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm text-white transition-all duration-200 bg-[#0070ba] hover:bg-[#005ea6] shadow-[0_4px_16px_rgba(0,112,186,0.4)]">
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
              <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
                <span className="text-gray-400 text-sm font-bold">Total</span>
                <span className="text-green-400 font-black">{fmtPrice(cart.reduce((a, c) => a + c.price, 0))}</span>
              </div>
              <button onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,112,186,0.35)]">
                <span className="font-black"><span className="text-[#009cde]">Pay</span><span className="text-white">Pal</span></span>
                Checkout
              </button>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                  {CAT_EMOJI[c.id] || ""} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/8 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                    <div className="h-8 bg-white/5 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map(item => (
                <ProductCard key={item._id} item={item} onCart={toggleCart} inCart={cart.some(c => c._id === item._id)} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌾</div>
              <p className="text-gray-400 font-bold mb-1">No products found</p>
              <p className="text-gray-600 text-sm">{search ? `No results for "${search}"` : "No products in this category yet."}</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/3 text-gray-400 text-sm font-bold hover:border-green-500/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={14} /> Prev
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  const isActive = p === page;
                  // Show first, last, current, and neighbors; hide others as "..."
                  if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                    return (
                      <button key={p}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-8 h-8 rounded-lg text-xs font-black border transition-all ${
                          isActive
                            ? "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_10px_rgba(0,166,81,0.2)]"
                            : "bg-white/3 border-white/10 text-gray-400 hover:border-green-500/25 hover:text-white"
                        }`}>
                        {p}
                      </button>
                    );
                  }
                  if (Math.abs(p - page) === 2) {
                    return <span key={p} className="text-gray-600 text-xs px-0.5">…</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/3 text-gray-400 text-sm font-bold hover:border-green-500/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Stats bar */}
          {!loading && products.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[0.7rem] text-gray-600">
              <span>
                Showing <span className="text-gray-400 font-bold">{(page - 1) * PAGE_SIZE + 1}</span>–<span className="text-gray-400 font-bold">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="text-gray-400 font-bold">{filtered.length}</span> products
              </span>
              <span className="flex items-center gap-1"><Sprout size={11} className="text-green-700" /> All sourced directly from farmers</span>
            </div>
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