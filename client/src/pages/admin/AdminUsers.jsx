import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  Search,
  Users,
  ShieldCheck,
  UserRound,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Mail,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function roleMeta(role) {
  const value = (role || "").toLowerCase();
  if (value === "admin") {
    return {
      label: "Admin",
      icon: ShieldCheck,
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  return {
    label: "Buyer",
    icon: UserRound,
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="px-6 py-4">
        <div className="h-4 w-40 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-56 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-8 w-24 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-36 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="ml-auto h-9 w-9 rounded-xl bg-slate-200" />
      </td>
    </tr>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setRefreshing(true);
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (_error) {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success(`User ${name} berhasil dihapus`);
      setDeleteConfirm(null);
      await loadUsers(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal hapus user");
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = (user.role || "").toLowerCase();
      const matchRole = roleFilter === "all" ? true : role === roleFilter;
      const matchSearch =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q);

      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter(
    (u) => (u.role || "").toLowerCase() === "admin",
  ).length;
  const buyerCount = users.filter(
    (u) => (u.role || "").toLowerCase() !== "admin",
  ).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-8"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white/90 ring-1 ring-white/10 backdrop-blur">
              <Sparkles size={14} />
              USER MANAGEMENT
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Kelola user dengan lebih rapi
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              Lihat akun admin dan buyer, filter data lebih cepat, dan hapus
              user dengan modal konfirmasi yang halus.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur sm:min-w-[320px]">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                Total User
              </p>
              <p className="mt-2 text-2xl font-black">{users.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                Admin
              </p>
              <p className="mt-2 text-2xl font-black">{adminCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                Buyer
              </p>
              <p className="mt-2 text-2xl font-black">{buyerCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                Tampilan
              </p>
              <p className="mt-2 text-2xl font-black">Live</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total User</p>
              <p className="text-2xl font-black text-slate-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <UserRound size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Buyer</p>
              <p className="text-2xl font-black text-slate-900">{buyerCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Admin</p>
              <p className="text-2xl font-black text-slate-900">{adminCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Daftar User
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter dan cari user dengan cepat.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100"
              >
                <option value="all">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="buyer">Buyer</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={() => loadUsers(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          {loading ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <tbody className="bg-white">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Nama
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Tanggal Daftar
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <AnimatePresence initial={false}>
                    {filteredUsers.map((user, index) => {
                      const meta = roleMeta(user.role);
                      const RoleIcon = meta.icon;

                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.22, delay: index * 0.02 }}
                          className="group hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black text-white">
                                {String(user.name || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {user.name}
                                </p>
                                <p className="flex items-center gap-1 text-xs text-slate-500">
                                  <CalendarDays size={12} />
                                  Terdaftar
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-slate-400" />
                              {user.email}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${meta.className}`}
                            >
                              <RoleIcon size={14} />
                              {meta.label}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {formatDate(user.createdAt)}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => setDeleteConfirm(user)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:scale-105"
                                aria-label={`Hapus ${user.name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                User tidak ditemukan
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Coba ubah kata kunci pencarian atau filter role supaya data yang
                dicari muncul.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Hapus User?
                  </h2>
                  <p className="text-sm text-slate-500">
                    Aksi ini tidak bisa dibatalkan.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  Yakin hapus{" "}
                  <strong className="text-slate-900">
                    {deleteConfirm.name}
                  </strong>
                  ?
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Email: {deleteConfirm.email}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={() =>
                    handleDelete(deleteConfirm.id, deleteConfirm.name)
                  }
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:from-red-700 hover:to-red-800"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
