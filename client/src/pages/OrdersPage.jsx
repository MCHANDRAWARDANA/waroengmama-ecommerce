import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Clock3,
  Eye,
  ReceiptText,
  RefreshCw,
  X,
  ArrowRight,
  Phone,
  Mail,
  User,
  CreditCard,
  StickyNote,
  Package,
} from "lucide-react";
import api from "../services/api";
import { formatRupiah } from "../utils/formatRupiah";

// ── Status helpers ────────────────────────────────────────────────────────────
function getStatusStyle(status) {
  const v = (status || "").toLowerCase();
  if (v === "paid")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (v === "pending")
    return "bg-amber-50 text-amber-700 border border-amber-200";
  if (v === "cancelled") return "bg-red-50 text-red-600 border border-red-200";
  return "bg-zinc-100 text-zinc-600 border border-zinc-200";
}

function getStatusLabel(status) {
  const v = (status || "").toLowerCase();
  if (v === "paid") return "Lunas";
  if (v === "pending") return "Menunggu Pembayaran";
  if (v === "cancelled") return "Dibatalkan";
  return status || "-";
}

// ── Dot background (identical to Hero) ───────────────────────────────────────
function BgLayer() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15, 23, 42, 0.22) 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-zinc-200 bg-white/80 p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-8 w-40 rounded-full bg-zinc-200" />
          <div className="h-6 w-32 rounded-xl bg-zinc-100" />
          <div className="h-4 w-48 rounded-lg bg-zinc-100" />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-4 w-16 rounded bg-zinc-100" />
          <div className="h-8 w-28 rounded-xl bg-zinc-200" />
        </div>
      </div>
      <div className="my-5 border-t border-zinc-100" />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex justify-between rounded-2xl bg-zinc-50 px-4 py-3"
          >
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded bg-zinc-200" />
              <div className="h-3 w-20 rounded bg-zinc-100" />
            </div>
            <div className="h-4 w-20 rounded bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Detail modal ─────────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  const items = order.OrderItems || order.order_items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet / dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-t-3xl bg-[#f6f2ea] shadow-2xl sm:rounded-3xl">
        {/* Drag handle (mobile) */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-zinc-300 sm:hidden" />

        {/* Inner scroll */}
        <div className="max-h-[88svh] overflow-y-auto">
          {/* Modal header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-[#f6f2ea]/90 px-6 py-4 backdrop-blur-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Detail Pesanan
              </p>
              <h2 className="mt-0.5 text-lg font-black tracking-tight text-zinc-900">
                {order.orderNumber}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white/80 text-zinc-500 transition hover:bg-white hover:text-zinc-800"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 px-6 py-5">
            {/* Customer info */}
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 backdrop-blur-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                Info Pelanggan
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: User, label: "Nama", value: order.customerName },
                  { icon: Mail, label: "Email", value: order.customerEmail },
                  {
                    icon: Phone,
                    label: "WhatsApp",
                    value: order.customerPhone,
                  },
                  {
                    icon: CreditCard,
                    label: "Pembayaran",
                    value: order.paymentMethod,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                      <Icon size={14} className="text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-400">{label}</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {value || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.note && (
                <div className="mt-4 flex items-start gap-3 border-t border-zinc-100 pt-4">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                    <StickyNote size={14} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-400">Catatan</p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {order.note}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 backdrop-blur-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                Item Pesanan
              </p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {item.quantity} × {formatRupiah(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-zinc-800">
                      {formatRupiah(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status + total */}
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-900 px-5 py-4">
              <div>
                <p className="text-xs text-zinc-400">Status</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Total Bayar</p>
                <p className="text-xl font-black text-white">
                  {formatRupiah(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/mine");
      setOrders(res.data.data || []);
    } catch {
      toast.error("Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const syncStatus = async (orderId) => {
    try {
      setSyncingId(orderId);
      await api.post(`/payments/midtrans/sync-status/${orderId}`);
      toast.success("Status berhasil disinkronkan");
      await loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal sync status");
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#f6f2ea]">
      <BgLayer />

      <div className="relative mx-auto max-w-6xl px-4 py-8 lg:py-10">
        {/* ── Page header ── */}
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            Riwayat Pesanan
          </span>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            Pesanan Kamu
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
            Pantau semua pesanan yang pernah kamu buat di WaroengMAMA.
          </p>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white/80 p-12 text-center shadow-sm backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
              <Package size={28} className="text-zinc-400" />
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-zinc-900">
              Belum ada pesanan
            </h2>
            <p className="mt-2 max-w-xs text-sm text-zinc-500">
              Kamu belum pernah checkout. Yuk mulai belanja sekarang!
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Belanja Sekarang
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* ── Order list ── */}
        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => {
              const items = order.OrderItems || order.order_items || [];

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-md"
                >
                  {/* Order header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      {/* Order number badge */}
                      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600">
                        <ReceiptText size={13} />
                        {order.orderNumber}
                      </div>

                      <h2 className="mt-3 text-lg font-black tracking-tight text-zinc-900">
                        {order.customerName}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                          <Clock3 size={13} />
                          {new Date(order.createdAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-zinc-400">Total Pesanan</p>
                      <p className="mt-1 text-2xl font-black tracking-tight text-zinc-900">
                        {formatRupiah(order.totalAmount)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-zinc-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                        >
                          <Eye size={14} />
                          Detail
                        </button>

                        <button
                          onClick={() => syncStatus(order.id)}
                          disabled={syncingId === order.id}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <RefreshCw
                            size={14}
                            className={
                              syncingId === order.id ? "animate-spin" : ""
                            }
                          />
                          {syncingId === order.id ? "Sync..." : "Refresh"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-zinc-100" />

                  {/* Item preview */}
                  <div className="space-y-2">
                    {items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {item.quantity} × {formatRupiah(item.price)}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-zinc-800">
                          {formatRupiah(item.subtotal)}
                        </p>
                      </div>
                    ))}

                    {items.length > 3 && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full rounded-xl border border-dashed border-zinc-200 py-2 text-xs font-semibold text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
                      >
                        +{items.length - 3} item lainnya — lihat semua
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail modal ── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </section>
  );
}
