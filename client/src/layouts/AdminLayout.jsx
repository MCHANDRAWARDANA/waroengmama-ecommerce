import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const [open, setOpen] = useState(false); // mobile sidebar
  const [collapsed, setCollapsed] = useState(false); // desktop sidebar
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { label: "Produk", path: "/admin/products", icon: Package },
      { label: "Pesanan", path: "/admin/orders", icon: ShoppingBag },
      { label: "User", path: "/admin/users", icon: Users },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "lg:w-20" : "lg:w-72"}
          w-72`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-5">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg">
                  <Sparkles size={18} />
                </div>

                <div
                  className={`min-w-0 transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:opacity-100"}`}
                >
                  <h1 className="truncate text-lg font-black tracking-tight text-slate-900">
                    WaroengMAMA
                  </h1>
                  <p className="truncate text-xs text-slate-500">
                    Admin Dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="hidden rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 lg:inline-flex"
                  title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
                >
                  {collapsed ? (
                    <ChevronRight size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
                </button>

                <button
                  className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 lg:hidden"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup sidebar"
                >
                  ✕
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-2 px-3 py-5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active =
                  location.pathname === item.path ||
                  (item.path !== "/admin" &&
                    location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 font-semibold transition-all duration-200
                      ${
                        active
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                      ${collapsed ? "lg:justify-center lg:px-3" : ""}
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span
                      className={`whitespace-nowrap transition-all ${collapsed ? "lg:hidden" : ""}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-4">
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200
                ${collapsed ? "lg:justify-center lg:px-3" : ""}`}
              >
                <LogOut size={18} className="shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all ${collapsed ? "lg:hidden" : ""}`}
                >
                  Logout
                </span>
              </button>
            </div>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <div
          className={`min-h-screen flex-1 transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}
        >
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <button
                  className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Buka sidebar"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Dashboard Admin
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-slate-900">
                    WaroengMAMA
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-bold text-white shadow-lg">
                  A
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <LogOut size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Yakin ingin logout?
                </h2>
                <p className="text-sm text-slate-500">
                  Anda akan keluar dari akun admin.
                </p>
              </div>
            </div>

            <p className="mb-6 leading-6 text-slate-600">
              Setelah logout, Anda akan diarahkan ke halaman login dan harus
              masuk lagi untuk mengakses dashboard.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:from-red-700 hover:to-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
