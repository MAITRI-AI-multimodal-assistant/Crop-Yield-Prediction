import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../../api/auth";
import logoSvg from "../../assets/logo.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const user      = getUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Predict",      path: "/predict" },
    { name: "Marketplace",  path: "/marketplace" },
    { name: "Notifications",path: "/notifications" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-[#020805] border-b border-green-900/30 py-3"
          : "bg-[#020805] py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center shrink-0">
          <img src={logoSvg} alt="KrishiPredict" className="h-11 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-grow justify-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-[0.82rem] font-semibold tracking-[0.12em] uppercase pb-1 group
                  transition-colors duration-200
                  ${active ? "text-green-400" : "text-gray-300 hover:text-green-400"}`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-green-500 to-emerald-600 rounded-full
                    transition-all duration-300
                    ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex ml-auto shrink-0 items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin"
                  className="px-4 py-2 rounded-lg border border-green-500/30 text-green-400 text-[0.78rem] font-bold tracking-[0.1em] uppercase hover:bg-green-500/10 transition-all duration-200">
                  Dashboard
                </Link>
              )}
              <span className="text-gray-400 text-[0.78rem] flex items-center gap-1.5">
                <User size={13} className="text-green-500" />
                {user.name?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[0.78rem] font-bold tracking-[0.1em] uppercase hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
              >
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white text-[0.8rem] font-black tracking-[0.12em] uppercase shadow-[0_0_16px_rgba(0,166,81,0.35)] hover:shadow-[0_0_28px_rgba(0,166,81,0.55)] hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden ml-auto text-white/80 hover:text-white p-1 transition-colors"
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="block">
                <X size={26} />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} className="block">
                <Menu size={26} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="md:hidden bg-[#030f06] border-t border-green-900/20 overflow-hidden"
          >
            <div className="px-6 py-2">
              {navLinks.map((link, i) => {
                const active = isActive(link.path);
                return (
                  <motion.div key={link.name} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06, duration: 0.22 }}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2.5 py-3.5 border-b border-white/5 last:border-none
                        font-bold text-base tracking-[0.1em] uppercase transition-colors duration-200
                        ${active ? "text-green-400" : "text-white/60 hover:text-green-400"}`}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" style={{ boxShadow: "0 0 6px rgba(0,204,99,0.8)" }} />}
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-4 pb-3">
                {user ? (
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="block text-center w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 font-black tracking-[0.12em] uppercase text-sm">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}
                    className="block text-center w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-[0.12em] uppercase text-sm shadow-[0_0_16px_rgba(0,166,81,0.3)]">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
