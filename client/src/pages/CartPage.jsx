import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../utils/formatRupiah";
import Modal from "../components/Modal";

export default function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    cartTotal,
  } = useCart();

  const [showClearModal, setShowClearModal] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ── Shared background (same as Hero) ─────────────────────────────────────
  const bgSection = (
    <>
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15, 23, 42, 0.22) 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* Soft overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />
    </>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <section className="relative min-h-[100svh] overflow-hidden bg-[#f6f2ea]">
        {bgSection}
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-10 shadow-xl backdrop-blur-sm max-w-md w-full">
            {/* Bag illustration */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
              <ShoppingBag size={36} className="text-zinc-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              Keranjang masih kosong
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Belum ada produk yang dipilih. Yuk tambahkan kebutuhanmu dulu!
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Lihat Produk
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Main cart ─────────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#f6f2ea]">
      {bgSection}

      <div className="relative mx-auto max-w-6xl px-4 py-8 lg:py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* Back link */}
            <Link
              to="/products"
              className="mb-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-800"
            >
              <ChevronLeft size={14} />
              Lanjut Belanja
            </Link>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Keranjang
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {totalItems} produk dipilih
            </p>
          </div>

          <button
            onClick={() => setShowClearModal(true)}
            className="self-start rounded-2xl border border-zinc-300 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-600 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:self-auto"
          >
            Kosongkan Keranjang
          </button>
        </div>

        {/* Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Item list ── */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Image + info */}
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover ring-1 ring-zinc-200"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-zinc-900">
                      {item.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {typeof item.category === "object"
                        ? item.category?.name || item.category?.id || "-"
                        : item.category || "-"}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-zinc-700">
                      {formatRupiah(item.price)}
                    </p>
                    {/* Subtotal per item */}
                    {item.quantity > 1 && (
                      <p className="mt-0.5 text-xs text-zinc-400">
                        Subtotal:{" "}
                        <span className="font-semibold text-zinc-600">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Qty + delete */}
                <div className="flex items-center gap-3">
                  {/* Qty counter */}
                  <div className="flex items-center overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-10 w-10 items-center justify-center text-zinc-600 transition hover:bg-zinc-50 active:scale-95"
                      aria-label="Kurangi"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="flex h-10 w-10 items-center justify-center text-zinc-600 transition hover:bg-zinc-50 active:scale-95"
                      aria-label="Tambah"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 active:scale-95"
                    aria-label="Hapus produk"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary sidebar ── */}
          <div className="h-fit rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-black tracking-tight text-zinc-900">
              Ringkasan Pesanan
            </h2>

            <Modal
              title="Kosongkan Keranjang?"

              open={showClearModal}
              onClose={() => setShowClearModal(false)}
            >
              <div className="text-slate-700">
                <p className="leading-relaxed">
                  Apakah anda yakin ingin mengosongkan keranjang?
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowClearModal(false)}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setShowClearModal(false);
                    }}
                    className="flex-1 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                  >
                    Ya, kosongkan
                  </button>
                </div>
              </div>
            </Modal>

            <div className="mt-5 space-y-3 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Total produk</span>
                <span className="font-semibold text-zinc-800">
                  {totalItems} item
                </span>
              </div>
              <div className="flex justify-between">
                <span>Jenis produk</span>
                <span className="font-semibold text-zinc-800">
                  {cartItems.length}
                </span>
              </div>

              <div className="my-1 border-t border-zinc-100" />

              <div className="flex justify-between text-base">
                <span className="font-semibold text-zinc-900">Total harga</span>
                <span className="font-black text-zinc-900">
                  {formatRupiah(cartTotal)}
                </span>
              </div>
            </div>

            {/* Note */}
            <p className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-xs leading-relaxed text-zinc-500">
              Harga belum termasuk ongkos kirim. Ongkir akan dihitung saat
              checkout.
            </p>

            <Link
              to="/checkout"
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 active:translate-y-0"
            >
              Lanjut Checkout
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/products"
              className="mt-3 flex items-center justify-center gap-1 rounded-2xl border border-zinc-200 bg-white/60 px-5 py-2.5 text-sm font-semibold text-zinc-600 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              <ChevronLeft size={14} />
              Tambah Produk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
