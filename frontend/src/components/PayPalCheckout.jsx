import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const CAT_EMOJI = { crops:"🌾", seeds:"🌱", fertilisers:"🧪", equipment:"🚜", pesticides:"🛡️" };

function PayPalSDKButton({ amount, buyerInfo, cart, onSuccess, onError }) {
  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect", color: "blue", label: "pay", height: 45 }}

     createOrder={async () => {
  try {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${base}/api/booking/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: cart.length }),
    });
    const text = await res.text();
    if (!text) throw new Error("Empty response from server. Is your backend running?");
    const data = JSON.parse(text);
    if (!res.ok || !data.id) throw new Error(data.error || "Failed to create order");
    return data.id;
  } catch (err) {
    onError(err.message);
    throw err;
  }
}}

      onApprove={async (data) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/capture-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderID:  data.orderID,
              name:     buyerInfo.name,
              phone:    buyerInfo.phone,
              email:    buyerInfo.email,
              address:  buyerInfo.address,
              pincode:  buyerInfo.pincode,
              products: cart.length,
            }),
          });
          const captureData = await res.json();
          if (!res.ok || !captureData.success) throw new Error(captureData.error || "Capture failed");
          onSuccess({ transactionId: data.orderID, amount });
        } catch (err) {
          onError(err.message);
        }
      }}

      onError={(err) => {
        console.error("PayPal error:", err);
        onError("Payment failed. Please try again.");
      }}

      onCancel={() => onError("Payment was cancelled.")}
    />
  );
}

const inputCls = "w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#0070ba]/60 focus:bg-[#0070ba]/5 transition-all";

export default function PayPalCheckout({ cart, onClose, onComplete }) {
  const [step, setStep]                   = useState("summary");
  const [qty, setQty]                     = useState(() => Object.fromEntries(cart.map(i => [i._id, 1])));
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [payError, setPayError]           = useState("");
  const [buyerInfo, setBuyerInfo]         = useState({ name:"", phone:"", email:"", address:"", pincode:"" });
  const [infoErr, setInfoErr]             = useState("");

  const INR_TO_USD  = 0.012;
  const subtotalInr = cart.reduce((s, item) => s + item.price * (qty[item._id] || 1), 0);
  const subtotalUsd = subtotalInr * INR_TO_USD;
  const taxUsd      = subtotalUsd * 0.05;
  const totalUsd    = subtotalUsd + taxUsd;

  const handleInfoChange = (e) => setBuyerInfo(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleProceed = () => {
    setInfoErr("");
    setPayError("");
    if (!buyerInfo.name.trim())    return setInfoErr("Full name is required.");
    if (!buyerInfo.phone.trim())   return setInfoErr("Phone number is required.");
    if (!buyerInfo.email.trim())   return setInfoErr("Email is required.");
    if (!buyerInfo.address.trim()) return setInfoErr("Delivery address is required.");
    if (!buyerInfo.pincode.trim()) return setInfoErr("Pincode is required.");
    setStep("payment");
  };

  const handleSuccess = ({ transactionId, amount }) => {
    setStep("success");
    if (onComplete) onComplete({ transactionId, amount, cart });
  };

  const STEPS = ["summary", "shipping", "payment"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(2,8,5,0.85)", backdropFilter: "blur(8px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-md bg-[#050e08] border border-green-900/30 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-green-400" />
              <span className="text-white font-black text-sm uppercase tracking-[0.12em]">
                {step === "summary" ? "Order Summary" : step === "shipping" ? "Delivery Details" : step === "payment" ? "Payment" : "Done"}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Step indicator */}
          {step !== "success" && (
            <div className="flex items-center px-6 pt-4 pb-2 shrink-0">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-black border transition-all ${
                    step === s               ? "bg-[#0070ba] border-[#0070ba] text-white" :
                    STEPS.indexOf(step) > i  ? "bg-green-500 border-green-500 text-white" :
                                               "bg-white/5 border-white/10 text-gray-500"
                  }`}>{i + 1}</div>
                  {i < 2 && <div className={`flex-1 h-px transition-all ${STEPS.indexOf(step) > i ? "bg-green-500" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

            {/* ── SUCCESS ── */}
            {step === "success" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={28} className="text-green-400" />
                </div>
                <h3 className="text-white font-black text-lg mb-2">Payment Successful 🎉</h3>
                <p className="text-gray-400 text-sm mb-1">Your order has been placed.</p>
                <p className="text-gray-500 text-xs mb-5">The farmers will contact you at <span className="text-gray-300">{buyerInfo.phone}</span> shortly.</p>
                <button onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wide">
                  Done
                </button>
              </motion.div>
            )}

            {/* ── SUMMARY ── */}
            {step === "summary" && (
              <>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-none">
                      <div className="w-10 h-10 rounded-lg shrink-0 bg-green-900/30 flex items-center justify-center text-lg overflow-hidden">
                        {item.img
                          ? <img src={item.img} alt={item.name} onError={e => { e.target.style.display="none"; }} className="w-full h-full object-cover" />
                          : CAT_EMOJI[item.category] || "📦"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">{item.name}</p>
                        <p className="text-gray-500 text-[0.65rem] truncate">{item.seller || item.state}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setQty(p => ({ ...p, [item._id]: Math.max(1, (p[item._id]||1)-1) }))}
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors">−</button>
                        <span className="text-white text-xs w-5 text-center">{qty[item._id]||1}</span>
                        <button onClick={() => setQty(p => ({ ...p, [item._id]: (p[item._id]||1)+1 }))}
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors">+</button>
                      </div>
                      <span className="text-green-400 text-xs font-bold shrink-0 w-16 text-right">
                        ₹{(item.price*(qty[item._id]||1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                  <button onClick={() => setShowBreakdown(p => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider">Price Breakdown</span>
                    {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div initial={{ height:0 }} animate={{ height:"auto" }} exit={{ height:0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-2 text-xs">
                          <div className="flex justify-between text-gray-400"><span>Subtotal (INR)</span><span>₹{subtotalInr.toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between text-gray-400"><span>Converted (USD @ ~0.012)</span><span>${subtotalUsd.toFixed(2)}</span></div>
                          <div className="flex justify-between text-gray-400"><span>Processing fee (5%)</span><span>${taxUsd.toFixed(2)}</span></div>
                          <div className="h-px bg-white/10" />
                          <div className="flex justify-between text-white font-black"><span>Total (USD)</span><span>${totalUsd.toFixed(2)}</span></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total</span>
                  <div className="text-right">
                    <div className="text-green-400 font-black text-lg">${totalUsd.toFixed(2)}</div>
                    <div className="text-gray-600 text-[0.65rem]">≈ ₹{subtotalInr.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                <button onClick={() => setStep("shipping")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_14px_rgba(0,166,81,0.3)] hover:shadow-[0_0_22px_rgba(0,166,81,0.5)] transition-all">
                  Continue to Delivery →
                </button>
              </>
            )}

            {/* ── SHIPPING ── */}
            {step === "shipping" && (
              <>
                {infoErr && <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">⚠️ {infoErr}</div>}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Full Name *</label>
                    <input name="name" value={buyerInfo.name} onChange={handleInfoChange} placeholder="Your full name" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Phone *</label>
                    <input name="phone" type="tel" value={buyerInfo.phone} onChange={handleInfoChange} placeholder="+91..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email *</label>
                    <input name="email" type="email" value={buyerInfo.email} onChange={handleInfoChange} placeholder="you@example.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Delivery Address *</label>
                    <input name="address" value={buyerInfo.address} onChange={handleInfoChange} placeholder="Village, District, State" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Pincode *</label>
                    <input name="pincode" value={buyerInfo.pincode} onChange={handleInfoChange} placeholder="700001" className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("summary")}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-black uppercase hover:border-white/25 hover:text-white transition-all">
                    ← Back
                  </button>
                  <button onClick={handleProceed}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_14px_rgba(0,166,81,0.3)] hover:shadow-[0_0_22px_rgba(0,166,81,0.5)] transition-all">
                    Pay Now →
                  </button>
                </div>
              </>
            )}

            {/* ── PAYMENT ── */}
            {step === "payment" && (
              <>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 space-y-1 text-xs">
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-2">Delivering to</p>
                  <p className="text-white font-bold">{buyerInfo.name} · {buyerInfo.phone}</p>
                  <p className="text-gray-400">{buyerInfo.address}, {buyerInfo.pincode}</p>
                  <p className="text-gray-500">{buyerInfo.email}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total</span>
                  <div className="text-right">
                    <div className="text-green-400 font-black text-lg">${totalUsd.toFixed(2)}</div>
                    <div className="text-gray-600 text-[0.65rem]">≈ ₹{subtotalInr.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                {payError && (
                  <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">⚠️ {payError}</div>
                )}

                <PayPalSDKButton
                  amount={totalUsd}
                  buyerInfo={buyerInfo}
                  cart={cart}
                  onSuccess={handleSuccess}
                  onError={setPayError}
                />

                <button onClick={() => { setStep("shipping"); setPayError(""); }}
                  className="w-full py-2 text-gray-600 text-xs hover:text-gray-400 transition-colors">
                  ← Edit delivery details
                </button>

                <div className="flex items-center justify-center gap-2 text-gray-600 text-[0.65rem]">
                  <ShieldCheck size={11} className="text-green-600" />
                  <span>256-bit SSL encrypted · Powered by PayPal</span>
                </div>
              </>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}