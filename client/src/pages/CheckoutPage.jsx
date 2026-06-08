import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { formatRupiah } from "../utils/formatRupiah";
import { useAuth } from "../context/AuthContext";
import { loadMidtrans } from "../utils/loadMidtrans";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    paymentMethod: "QRIS",
    note: "",
  });

  useEffect(() => {
    loadMidtrans().catch(() => {
      toast.error("Gagal memuat Midtrans Snap");
    });
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      customerName: user?.name || prev.customerName,
      customerEmail: user?.email || prev.customerEmail,
    }));
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      toast.error("Keranjang masih kosong");
      return;
    }

    if (
      !form.customerName ||
      !form.customerEmail ||
      !form.customerPhone ||
      !form.paymentMethod
    ) {
      toast.error("Lengkapi data checkout");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const orderRes = await api.post("/orders", payload);
      const createdOrder = orderRes.data.data;

      const tokenRes = await api.post("/payments/midtrans/token", {
        orderId: createdOrder.id,
      });

      const snap = await loadMidtrans();

      if (!snap) {
        toast.error("Midtrans Snap belum termuat");
        return;
      }

      const syncOrderStatus = async () => {
        try {
          await api.post(`/payments/midtrans/sync-status/${createdOrder.id}`);
        } catch (err) {
          console.error("SYNC STATUS ERROR:", err);
        }
      };

      snap.pay(tokenRes.data.data.token, {
        onSuccess: async () => {
          await syncOrderStatus();
          clearCart();
          toast.success("Pembayaran berhasil");
          navigate(`/orders/success/${createdOrder.id}`);
        },
        onPending: async () => {
          await syncOrderStatus();
          toast("Pembayaran sedang diproses");
          navigate(`/orders/success/${createdOrder.id}`);
        },
        onError: () => {
          toast.error("Pembayaran gagal");
        },
        onClose: () => {
          toast("Kamu menutup pembayaran");
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f6f2ea] py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15, 23, 42, 0.18) 2px, transparent 2px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/25" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-6">
          <p className="mb-2 inline-flex rounded-full border border-zinc-300 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700 shadow-sm backdrop-blur">
            Checkout
          </p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-4xl">
            Selesaikan Pesanan
          </h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <form
            onSubmit={handleCheckout}
            className="rounded-[1.5rem] border border-zinc-200 bg-white/85 p-4 shadow-sm backdrop-blur md:p-5"
          >
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              Data Pembeli
            </h2>

            <div className="space-y-3.5">
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="Alamat email"
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <input
                type="text"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="Nomor WhatsApp"
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <textarea
                name="note"
                rows="3"
                value={form.note}
                onChange={handleChange}
                placeholder="Catatan pesanan..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-zinc-700">
                  Metode Pembayaran
                </label>

                <div className="space-y-2">
                  {["QRIS", "Transfer Bank", "Bayar di Warung"].map(
                    (method) => (
                      <label
                        key={method}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm hover:border-zinc-900"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={form.paymentMethod === method}
                          onChange={handleChange}
                          className="h-4 w-4 accent-black"
                        />
                        <span className="text-zinc-700">{method}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
          </form>

          <div className="h-fit rounded-[1.5rem] border border-zinc-200 bg-white/85 p-4 shadow-sm backdrop-blur md:p-5">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.quantity} x {formatRupiah(item.price)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-zinc-900">
                    {formatRupiah(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-zinc-200" />

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-700">Total</p>
              <p className="text-xl font-black text-zinc-900">
                {formatRupiah(cartTotal)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
