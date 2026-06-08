import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Produk" },
    { path: "/cart", label: "Keranjang" },
    { path: "/orders", label: "Pesanan" },
  ];

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.paddingTop = "0px";

    return () => {
      document.body.style.paddingTop = "0px";
    };
  }, []);

  return (
    <nav className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div
          className={`rounded-full border px-3 sm:px-4 py-2 transition-all duration-300 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-lg"
              : "bg-white border-slate-200 shadow-md"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm">
                W
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-bold text-slate-900">WaroengMAMA</p>
                <p className="text-[11px] text-slate-500">
                  Belanja cepat dekat
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-emerald-100 text-emerald-700 font-semibold shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/cart"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:scale-[1.03]"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu Desktop */}
              <div className="relative hidden sm:block" ref={dropdownRef}>
                {user ? (
                  <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-2 h-10 rounded-full border border-slate-200 bg-slate-50 px-2.5 pr-3 transition-all duration-300 hover:bg-slate-100"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                      {getInitials(user.name)}
                    </div>
                    <ChevronDown size={14} className="text-slate-500" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-slate-50 transition-all duration-300 hover:bg-slate-100"
                  >
                    <User size={16} className="text-slate-700" />
                  </Link>
                )}

                {user && open && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-black flex items-center justify-center text-xs font-bold shadow-lg">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name || "User"}
                          </p>
                          <p className="truncate text-xs text-white/60">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                          isAdmin
                            ? "bg-red-500/15 text-red-300 border-red-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="p-2">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard Admin
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200"
                      >
                        <ShoppingCart size={16} />
                        Pesanan Saya
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-slate-50 transition-all duration-300 hover:bg-slate-100"
              >
                {mobileOpen ? (
                  <X size={18} className="text-slate-700" />
                ) : (
                  <Menu size={18} className="text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden mt-3 border-t border-slate-200 pt-3">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 px-1">
                {!user ? (
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-300"
                  >
                    <User size={16} />
                    Login
                  </Link>
                ) : (
                  <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                )}

                {user && (
                  <button
                    onClick={handleLogout}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-all duration-300"
                  >
                    Logout
                  </button>
                )}
              </div>

              {user && isAdmin && (
                <Link
                  to="/admin"
                  className="mt-2 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-300"
                >
                  <LayoutDashboard size={16} />
                  Dashboard Admin
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
