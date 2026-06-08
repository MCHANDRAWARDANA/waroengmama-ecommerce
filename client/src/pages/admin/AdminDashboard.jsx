import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Layers3,
  Boxes,
  AlertTriangle,
  BadgeCheck,
  Clock3,
  CircleX,
  TrendingUp,
  ShoppingCart,
  Sparkles,
  Plus,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { fetchProducts, fetchCategories } from "../../services/productService";
import api from "../../services/api";
import { formatRupiah } from "../../utils/formatRupiah";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({ label, value, icon: Icon, color, bg, subvalue, trend }) {
  const isUp = trend?.direction === "up";
  const isDown = trend?.direction === "down";

  return (
    <div className="group rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>
          {subvalue ? (
            <p className="mt-2 text-sm text-slate-500">{subvalue}</p>
          ) : null}
          {trend?.label ? (
            <div
              className={cn(
                "mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                isUp && "bg-emerald-50 text-emerald-700",
                isDown && "bg-rose-50 text-rose-700",
                !isUp && !isDown && "bg-slate-100 text-slate-600",
              )}
            >
              {isUp ? <ArrowUpRight size={14} /> : null}
              {isDown ? <ArrowDownRight size={14} /> : null}
              {trend.label}
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            bg,
          )}
        >
          <Icon className={color} size={22} />
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status) {
  const value = (status || "").toLowerCase();
  if (value === "paid") return "Lunas";
  if (value === "pending") return "Pending";
  if (value === "cancelled") return "Dibatalkan";
  return status || "-";
}

function getStatusStyle(status) {
  const value = (status || "").toLowerCase();
  if (value === "paid")
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (value === "pending")
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  if (value === "cancelled")
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

const CHART_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
];

function formatShortDate(value) {
  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "-";
  }
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setRefreshing(true);

      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchCategories(),
        api.get("/orders"),
      ]);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setOrders(ordersRes.data.data || []);
    } catch (_error) {
      toast.error("Gagal memuat dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalStock = products.reduce(
    (acc, item) => acc + Number(item.stock || 0),
    0,
  );
  const lowStockProducts = products.filter(
    (item) => Number(item.stock || 0) <= 10,
  );
  const paidOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "paid",
  );
  const pendingOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending",
  );
  const cancelledOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "cancelled",
  );
  const totalRevenue = paidOrders.reduce(
    (acc, order) => acc + Number(order.totalAmount || 0),
    0,
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const categoryData = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const name = p.Category?.name || "Tanpa Kategori";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [products]);

  const orderStatusData = useMemo(
    () => [
      { name: "Lunas", value: paidOrders.length },
      { name: "Pending", value: pendingOrders.length },
      { name: "Dibatalkan", value: cancelledOrders.length },
    ],
    [paidOrders.length, pendingOrders.length, cancelledOrders.length],
  );

  const stockByCategoryData = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const name = p.Category?.name || "Tanpa Kategori";
      map.set(name, (map.get(name) || 0) + Number(p.stock || 0));
    });
    return [...map.entries()]
      .map(([name, stock]) => ({ name, stock }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 6);
  }, [products]);

  const revenueTrendData = useMemo(() => {
    const buckets = new Map();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, 0);
    }

    paidOrders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key) + Number(order.totalAmount || 0));
      }
    });

    return [...buckets.entries()].map(([date, revenue]) => ({
      date: formatShortDate(date),
      revenue,
    }));
  }, [paidOrders]);

  const orderCountTrendData = useMemo(() => {
    const buckets = new Map();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, 0);
    }

    orders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key) + 1);
      }
    });

    return [...buckets.entries()].map(([date, count]) => ({
      date: formatShortDate(date),
      count,
    }));
  }, [orders]);

  const insights = useMemo(() => {
    const topCategory = categoryData[0]?.name || "-";
    const lowStockLabel =
      lowStockProducts.length > 0
        ? `${lowStockProducts.length} produk`
        : "Tidak ada";
    const revenueGrowth =
      revenueTrendData.length >= 2
        ? revenueTrendData[revenueTrendData.length - 1].revenue -
          revenueTrendData[0].revenue
        : 0;

    return [
      {
        title: "Kategori terkuat",
        value: topCategory,
        icon: PieChart,
        note: "Kategori dengan item terbanyak saat ini.",
      },
      {
        title: "Stok kritis",
        value: lowStockLabel,
        icon: AlertTriangle,
        note: "Segera cek produk yang mulai menipis.",
      },
      {
        title: "Pergerakan omzet 7 hari",
        value: formatRupiah(Math.max(revenueGrowth, 0)),
        icon: TrendingUp,
        note:
          revenueGrowth >= 0
            ? "Tren naik dibanding hari awal."
            : "Perlu dorongan penjualan.",
      },
    ];
  }, [categoryData, lowStockProducts.length, revenueTrendData]);

  const quickActions = [
    { label: "Tambah Produk", icon: Plus, hint: "Input produk baru" },
    { label: "Export Data", icon: Download, hint: "Backup laporan" },
    { label: "Refresh", icon: RefreshCw, hint: "Muat ulang dashboard" },
    { label: "Lihat Laporan", icon: FileText, hint: "Pantau performa" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-3xl border border-slate-200 bg-white/80" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-3xl border border-slate-200 bg-white/80"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white/80" />
          <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.20)] md:p-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/10 backdrop-blur">
              <Sparkles size={16} />
              Dashboard Admin Premium
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Selamat datang di WaroengMAMA
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
              Pantau performa toko secara real-time: omzet, pesanan, stok
              produk, kategori, dan insight bisnis dalam satu layar.
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur sm:grid-cols-2 xl:min-w-[360px]">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                Total Omzet
              </p>
              <p className="mt-2 text-2xl font-bold">
                {formatRupiah(totalRevenue)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                Pesanan
              </p>
              <p className="mt-2 text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                Produk
              </p>
              <p className="mt-2 text-2xl font-bold">{totalProducts}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                Stok Rendah
              </p>
              <p className="mt-2 text-2xl font-bold">
                {lowStockProducts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Produk"
          value={totalProducts}
          icon={Package}
          color="text-emerald-700"
          bg="bg-emerald-50"
          subvalue="Semua produk aktif di katalog"
          trend={{ label: "Inventori utama", direction: "up" }}
        />
        <StatCard
          label="Total Kategori"
          value={totalCategories}
          icon={Layers3}
          color="text-blue-700"
          bg="bg-blue-50"
          subvalue="Pengelompokan item toko"
          trend={{ label: "Struktur rapi", direction: "up" }}
        />
        <StatCard
          label="Total Stok"
          value={totalStock}
          icon={Boxes}
          color="text-orange-700"
          bg="bg-orange-50"
          subvalue="Akumulasi stok seluruh produk"
          trend={{ label: "Pantau pergerakan", direction: "up" }}
        />
        <StatCard
          label="Stok Rendah"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="text-rose-700"
          bg="bg-rose-50"
          subvalue="Perlu restock segera"
          trend={{
            label: "Prioritas tinggi",
            direction: lowStockProducts.length > 0 ? "down" : "up",
          }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Order Lunas"
          value={paidOrders.length}
          icon={BadgeCheck}
          color="text-emerald-700"
          bg="bg-emerald-50"
          subvalue="Pesanan yang sudah dibayar"
          trend={{ label: "Konversi positif", direction: "up" }}
        />
        <StatCard
          label="Order Pending"
          value={pendingOrders.length}
          icon={Clock3}
          color="text-amber-700"
          bg="bg-amber-50"
          subvalue="Menunggu proses pembayaran"
          trend={{
            label: "Butuh follow-up",
            direction: pendingOrders.length > 0 ? "down" : "up",
          }}
        />
        <StatCard
          label="Order Dibatalkan"
          value={cancelledOrders.length}
          icon={CircleX}
          color="text-rose-700"
          bg="bg-rose-50"
          subvalue="Order yang tidak jadi"
          trend={{ label: "Perlu evaluasi", direction: "down" }}
        />
        <StatCard
          label="Total Omzet"
          value={formatRupiah(totalRevenue)}
          icon={TrendingUp}
          color="text-violet-700"
          bg="bg-violet-50"
          subvalue="Hanya dari order lunas"
          trend={{ label: "Pendapatan terkumpul", direction: "up" }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Activity size={14} />
                Analytics
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                Grafik Omzet 7 Hari
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pergerakan pendapatan harian dari order yang sudah lunas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh Data
            </button>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
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
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
              <PieChart size={14} />
              Breakdown
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Status Order & Kategori
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ringkasan cepat untuk lihat kondisi toko.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="h-[220px] rounded-3xl bg-slate-50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {insights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-700">
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{item.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                <ShoppingCart size={14} />
                Orders
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                Order Terbaru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                5 pesanan terakhir yang masuk.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {order.customerName} •{" "}
                        {new Date(order.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-bold text-emerald-700">
                        {formatRupiah(order.totalAmount)}
                      </p>
                      <span
                        className={cn(
                          "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          getStatusStyle(order.status),
                        )}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                Belum ada order.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                <AlertTriangle size={14} />
                Stock Alert
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                Produk Stok Rendah
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Produk dengan stok 10 ke bawah.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {lowStockProducts.slice(0, 5).length > 0 ? (
              lowStockProducts.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {item.Category?.name || "-"}
                    </p>
                  </div>

                  <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
                    Stok: {item.stock}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                Stok semua produk masih aman.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-xl bg-slate-900 p-2 text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h3>
              <p className="text-sm text-slate-500">
                Shortcut biar kerja lebih cepat.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  className="group rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {action.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {action.hint}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-2 text-white transition group-hover:scale-105">
                      <Icon size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              <BarChart3 size={14} />
              Stock & Category
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Stok per Kategori
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lihat kategori mana yang paling banyak menyimpan stok.
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
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
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="stock"
                  name="Stok"
                  radius={[12, 12, 0, 0]}
                  fill="#6366f1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Activity size={14} />
              Trend
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Order Count 7 Hari
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Jumlah pesanan yang masuk per hari.
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={orderCountTrendData}>
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
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Pesanan"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
