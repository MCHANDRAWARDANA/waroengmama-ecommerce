import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Clock3,
  Eye,
  RefreshCw,
  Trash2,
  X,
  CheckCircle2,
  BadgeDollarSign,
  Search,
  Filter,
  ChevronDown,
  ShoppingBag,
  CircleDollarSign,
  PackageSearch,
  Sparkles,
  MoreHorizontal,
  BarChart3,
  Loader2,
  CalendarDays,
  User,
  Phone,
  Mail,
  CreditCard,
  ReceiptText,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../services/api";
import { formatRupiah } from "../../utils/formatRupiah";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDateTime(value) {
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

function getStatusStyle(status) {
  const value = (status || "").toLowerCase();
  if (value === "paid")
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (value === "pending")
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  if (value === "cancelled")
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (value === "done") return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

function getStatusLabel(status) {
  const value = (status || "").toLowerCase();
  if (value === "paid") return "Lunas";
  if (value === "pending") return "Pending";
  if (value === "cancelled") return "Dibatalkan";
  if (value === "done") return "Selesai";
  return status || "-";
}

function getStatusColor(status) {
  const value = (status || "").toLowerCase();
  if (value === "paid") return "#10b981";
  if (value === "pending") return "#f59e0b";
  if (value === "cancelled") return "#f43f5e";
  if (value === "done") return "#0ea5e9";
  return "#64748b";
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="px-5 py-4">
        <div className="h-4 w-44 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-48 rounded bg-slate-100" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-16 rounded bg-slate-100" />
      </td>
      <td className="px-5 py-4">
        <div className="h-8 w-24 rounded-full bg-slate-200" />
      </td>
      <td className="px-5 py-4 text-right">
        <div className="ml-auto h-10 w-10 rounded-2xl bg-slate-200" />
      </td>
    </tr>
  );
}

function MetricCard({ label, value, icon: Icon, hint, tone }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-xs text-slate-500">{hint}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            tone.bg,
          )}
        >
          <Icon className={tone.fg} size={20} />
        </div>
      </div>
    </div>
  );
}

function ActionMenu({ order, onView, onSync, onStatus, onDelete, syncing }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        aria-label="Buka menu aksi"
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-30 mt-3 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl"
          >
            <button
              onClick={() => {
                onView(order);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Eye size={16} /> Detail
            </button>

            <button
              onClick={async () => {
                await onSync(order.id);
                setOpen(false);
              }}
              disabled={syncing}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />{" "}
              Sync Status
            </button>

            <button
              onClick={() => {
                onStatus(order.id, "paid");
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              <CheckCircle2 size={16} /> Mark Paid
            </button>

            <button
              onClick={() => {
                onStatus(order.id, "done");
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-50"
            >
              <CheckCircle2 size={16} /> Mark Done
            </button>

            <button
              onClick={() => {
                onDelete(order.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
            >
              <Trash2 size={16} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [syncingId, setSyncingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      const res = await api.get("/orders");
      setOrders(res.data.data || []);
    } catch (_error) {
      toast.error("Gagal memuat data order");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const syncStatus = async (id) => {
    try {
      setSyncingId(id);
      await api.post(`/payments/midtrans/sync-status/${id}`);
      toast.success("Status berhasil disinkronkan");
      await loadOrders(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal sync status");
    } finally {
      setSyncingId(null);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Status order diperbarui");
      await loadOrders(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal update status");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus order ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/orders/${id}`);
      toast.success("Order berhasil dihapus");
      await loadOrders(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal hapus order");
    }
  };

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = orders.filter((order) => {
      const status = (order.status || "").toLowerCase();
      const matchStatus =
        statusFilter === "all" ? true : status === statusFilter;
      const matchSearch =
        !q ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.customerEmail?.toLowerCase().includes(q) ||
        order.customerPhone?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });

    const sorted = [...base];
    sorted.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      if (sortBy === "oldest") return da - db;
      if (sortBy === "highest")
        return Number(b.totalAmount || 0) - Number(a.totalAmount || 0);
      if (sortBy === "lowest")
        return Number(a.totalAmount || 0) - Number(b.totalAmount || 0);
      return db - da;
    });
    return sorted;
  }, [orders, search, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const paid = orders.filter(
      (o) => (o.status || "").toLowerCase() === "paid",
    );
    const pending = orders.filter(
      (o) => (o.status || "").toLowerCase() === "pending",
    );
    const cancelled = orders.filter(
      (o) => (o.status || "").toLowerCase() === "cancelled",
    );
    const done = orders.filter(
      (o) => (o.status || "").toLowerCase() === "done",
    );
    const revenue = paid.reduce(
      (acc, order) => acc + Number(order.totalAmount || 0),
      0,
    );

    return { paid, pending, cancelled, done, revenue };
  }, [orders]);

  const chartData = useMemo(() => {
    const buckets = new Map();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, 0);
    }

    stats.paid.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (buckets.has(key))
        buckets.set(key, buckets.get(key) + Number(order.totalAmount || 0));
    });

    return [...buckets.entries()].map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      revenue,
    }));
  }, [stats.paid]);

  const pieData = useMemo(
    () =>
      [
        { name: "Lunas", value: stats.paid.length },
        { name: "Pending", value: stats.pending.length },
        { name: "Selesai", value: stats.done.length },
        { name: "Dibatalkan", value: stats.cancelled.length },
      ].filter((item) => item.value > 0),
    [stats],
  );

  const metricCards = [
    {
      label: "Total Order",
      value: orders.length,
      icon: ShoppingBag,
      hint: "Semua pesanan yang masuk",
      tone: { bg: "bg-slate-100", fg: "text-slate-700" },
    },
    {
      label: "Pending",
      value: stats.pending.length,
      icon: Clock3,
      hint: "Menunggu aksi admin",
      tone: { bg: "bg-amber-50", fg: "text-amber-700" },
    },
    {
      label: "Paid",
      value: stats.paid.length,
      icon: CheckCircle2,
      hint: "Sudah dibayar customer",
      tone: { bg: "bg-emerald-50", fg: "text-emerald-700" },
    },
    {
      label: "Revenue",
      value: formatRupiah(stats.revenue),
      icon: CircleDollarSign,
      hint: "Dari order berstatus paid",
      tone: { bg: "bg-sky-50", fg: "text-sky-700" },
    },
  ];

  const recentOrders = useMemo(() => [...orders].slice(0, 5), [orders]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-10 w-80 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[420px] animate-pulse rounded-[2rem] border border-slate-200 bg-white" />
          <div className="h-[420px] animate-pulse rounded-[2rem] border border-slate-200 bg-white" />
        </div>
        <div className="h-[420px] animate-pulse rounded-[2rem] border border-slate-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-200">
              <Sparkles size={14} />
              ADMIN ORDERS
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Kelola pesanan dengan lebih nyaman
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Pantau transaksi, sinkronkan status pembayaran, dan buka detail
              order tanpa bikin tampilan terasa penuh.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                <BarChart3 size={14} /> Analytics
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                Grafik omzet 7 hari terakhir
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Data dari order berstatus lunas.
              </p>
            </div>
          </div>

          <div className="mt-5 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Omzet"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
            <PackageSearch size={14} /> Ringkasan
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            Status order
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Distribusi pesanan berdasarkan status.
          </p>

          <div className="mt-5 h-[260px] rounded-[1.5rem] bg-slate-50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={getStatusColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Pending",
                value: stats.pending.length,
                cls: "bg-amber-50 text-amber-700 ring-amber-200",
              },
              {
                label: "Paid",
                value: stats.paid.length,
                cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
              },
              {
                label: "Done",
                value: stats.done.length,
                cls: "bg-sky-50 text-sky-700 ring-sky-200",
              },
              {
                label: "Cancelled",
                value: stats.cancelled.length,
                cls: "bg-rose-50 text-rose-700 ring-rose-200",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl px-4 py-3 ring-1 ${item.cls}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Daftar pesanan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Cari, filter, dan urutkan order dengan lebih cepat.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 xl:flex xl:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari order, nama, email..."
                className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="highest">Total tertinggi</option>
                <option value="lowest">Total terendah</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Order
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Customer
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Total
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filteredOrders.length > 0 ? (
                  <AnimatePresence initial={false}>
                    {filteredOrders.map((order, index) => {
                      const items = order.OrderItems || order.order_items || [];
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.015 }}
                          className="group hover:bg-slate-50"
                        >
                          <td className="px-5 py-4 align-top">
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                              <BadgeDollarSign size={16} />
                              {order.orderNumber}
                            </div>
                            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                              <Clock3 size={14} />
                              {formatDateTime(order.createdAt)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {items.length} item
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top text-slate-600">
                            <p className="font-semibold text-slate-900">
                              {order.customerName}
                            </p>
                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                              <Mail size={14} />
                              {order.customerEmail || "-"}
                            </p>
                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                              <Phone size={14} />
                              {order.customerPhone || "-"}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top text-slate-600">
                            <p className="font-bold text-slate-900">
                              {formatRupiah(order.totalAmount)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {items.length} barang
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-4 py-2 text-sm font-semibold",
                                getStatusStyle(order.status),
                              )}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="flex justify-end">
                              <ActionMenu
                                order={order}
                                syncing={syncingId === order.id}
                                onView={setSelectedOrder}
                                onSync={syncStatus}
                                onStatus={updateStatus}
                                onDelete={deleteOrder}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                        <PackageSearch size={24} />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-slate-900">
                        Order tidak ditemukan
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Coba ubah kata kunci pencarian atau filter status.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="flex items-center gap-2">
          <ReceiptText size={18} className="text-slate-500" />
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Order terbaru
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan 5 pesanan terakhir yang masuk.
        </p>

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.customerName}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      getStatusStyle(order.status),
                    )}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p className="mt-4 text-lg font-black text-emerald-700">
                  {formatRupiah(order.totalAmount)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </button>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Belum ada order terbaru.
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                    Detail Order
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Tutup detail order"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Customer
                        </p>
                        <div className="mt-2 space-y-3">
                          <p className="flex items-center gap-2 font-semibold text-slate-900">
                            <User size={16} className="text-slate-400" />
                            {selectedOrder.customerName || "-"}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={16} className="text-slate-400" />
                            {selectedOrder.customerEmail || "-"}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={16} className="text-slate-400" />
                            {selectedOrder.customerPhone || "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Pembayaran
                        </p>
                        <div className="mt-2 space-y-3">
                          <p className="flex items-center gap-2 font-semibold text-slate-900">
                            <CreditCard size={16} className="text-slate-400" />
                            {selectedOrder.paymentMethod || "-"}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-slate-600">
                            <BadgeDollarSign
                              size={16}
                              className="text-slate-400"
                            />
                            {selectedOrder.orderNumber}
                          </p>
                          <p
                            className={cn(
                              "inline-flex w-fit rounded-full px-3 py-2 text-sm font-semibold",
                              getStatusStyle(selectedOrder.status),
                            )}
                          >
                            {getStatusLabel(selectedOrder.status)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.note && (
                      <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Catatan
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {selectedOrder.note}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <ShoppingBag size={18} className="text-slate-500" />
                      <h3 className="text-xl font-black tracking-tight text-slate-900">
                        Item pesanan
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {(
                        selectedOrder.OrderItems ||
                        selectedOrder.order_items ||
                        []
                      ).length > 0 ? (
                        (
                          selectedOrder.OrderItems ||
                          selectedOrder.order_items ||
                          []
                        ).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                          >
                            <div>
                              <p className="font-semibold text-slate-900">
                                {item.productName}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.quantity} x {formatRupiah(item.price)}
                              </p>
                            </div>

                            <p className="font-bold text-slate-900">
                              {formatRupiah(item.subtotal)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                          Tidak ada item pesanan.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      Total Bayar
                    </p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-white">
                      {formatRupiah(selectedOrder.totalAmount)}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                      <CalendarDays size={16} />{" "}
                      {formatDateTime(selectedOrder.createdAt)}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Quick actions
                    </p>
                    <div className="mt-4 grid gap-3">
                      <button
                        onClick={() => syncStatus(selectedOrder.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <RefreshCw
                          size={16}
                          className={
                            syncingId === selectedOrder.id ? "animate-spin" : ""
                          }
                        />
                        Sync Status
                      </button>
                      <button
                        onClick={() => updateStatus(selectedOrder.id, "paid")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <CheckCircle2 size={16} /> Mark Paid
                      </button>
                      <button
                        onClick={() => updateStatus(selectedOrder.id, "done")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                      >
                        <CheckCircle2 size={16} /> Mark Done
                      </button>
                      <button
                        onClick={() => deleteOrder(selectedOrder.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        <Trash2 size={16} /> Hapus Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
