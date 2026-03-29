import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb"; // sandbox by default

function PayPalButton({ amount, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handlePayPalRedirect = () => {
    setLoading(true);
    // In production replace with PayPal JS SDK integration
    // For demo: open PayPal sandbox checkout
    const returnUrl = encodeURIComponent(window.location.href + "?payment=success");
    const cancelUrl = encodeURIComponent(window.location.href + "?payment=cancelled");
    const paypalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=sb-business@krishipredict.com&amount=${amount}&currency_code=USD&item_name=KrishiPredict+Marketplace+Order&return=${returnUrl}&cancel_return=${cancelUrl}`;

    // Simulated payment for demo purposes
    setTimeout(() => {
      setLoading(false);
      onSuccess({ transactionId: "DEMO_" + Date.now(), amount });
    }, 2000);
  };

  return (
    <button
      onClick={handlePayPalRedirect}
      disabled={loading}
      className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200
        bg-[#0070ba] hover:bg-[#005ea6] text-white shadow-[0_4px_16px_rgba(0,112,186,0.4)]
        hover:shadow-[0_4px_24px_rgba(0,112,186,0.6)] disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {/* PayPal logo text */}
          <span className="font-black text-[#003087]" style={{ textShadow: "none" }}>
            <span className="text-[#009cde]">Pay</span>
            <span className="text-[#003087]">Pal</span>
          </span>
          Pay — ${amount.toFixed(2)}
        </>
      )}
    </button>
  );
}

export default function PayPalCheckout({ cart, onClose, onComplete }) {
  const [step, setStep]           = useState("summary"); // summary | processing | success
  const [qty, setQty]             = useState(() => Object.fromEntries(cart.map((i) => [i._id, 1])));
  const [showBreakdown, setShowBreakdown] = useState(false);

  const INR_TO_USD = 0.012; // approximate conversion
  const subtotalInr = cart.reduce((s, item) => s + item.price * (qty[item._id] || 1), 0);
  const subtotalUsd = subtotalInr * INR_TO_USD;
  const taxUsd      = subtotalUsd * 0.05;
  const totalUsd    = subtotalUsd + taxUsd;

  const handleSuccess = ({ transactionId, amount }) => {
    setStep("success");
    if (onComplete) onComplete({ transactionId, amount, cart });
  };

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
          className="relative w-full max-w-md bg-[#050e08] border border-green-900/30 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-green-400" />
              <span className="text-white font-black text-sm uppercase tracking-[0.12em]">
                Checkout
              </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {step === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={28} className="text-green-400" />
                </div>
                <h3 className="text-white font-black text-lg mb-2">Payment Successful</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Your order has been placed. The farmers will contact you shortly.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wide"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                {/* Cart items */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 py-2 border-b border-white/5 last:border-none"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">{item.name}</p>
                        <p className="text-gray-500 text-[0.65rem] truncate">{item.seller}</p>
                      </div>
                      {/* Qty */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() =>
                            setQty((p) => ({ ...p, [item._id]: Math.max(1, (p[item._id] || 1) - 1) }))
                          }
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                        >
                          −
                        </button>
                        <span className="text-white text-xs w-5 text-center">{qty[item._id] || 1}</span>
                        <button
                          onClick={() =>
                            setQty((p) => ({ ...p, [item._id]: (p[item._id] || 1) + 1 }))
                          }
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-green-400 text-xs font-bold shrink-0 w-16 text-right">
                        ₹{(item.price * (qty[item._id] || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown toggle */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowBreakdown((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">Price Breakdown</span>
                    {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2 text-xs">
                          <div className="flex justify-between text-gray-400">
                            <span>Subtotal (INR)</span>
                            <span>₹{subtotalInr.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Converted (USD @ ~0.012)</span>
                            <span>${subtotalUsd.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Processing fee (5%)</span>
                            <span>${taxUsd.toFixed(2)}</span>
                          </div>
                          <div className="h-px bg-white/10" />
                          <div className="flex justify-between text-white font-black">
                            <span>Total (USD)</span>
                            <span>${totalUsd.toFixed(2)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Total row */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total</span>
                  <div className="text-right">
                    <div className="text-green-400 font-black text-lg">
                      ${totalUsd.toFixed(2)}
                    </div>
                    <div className="text-gray-600 text-[0.65rem]">
                      ≈ ₹{subtotalInr.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                {/* PayPal button */}
                <PayPalButton amount={totalUsd} onSuccess={handleSuccess} onError={() => {}} />

                {/* Trust badge */}
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
