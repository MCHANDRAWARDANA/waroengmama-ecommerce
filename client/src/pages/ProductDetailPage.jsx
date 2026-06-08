import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  BadgeAlert,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";
import { fetchProductById } from "../services/productService";
import { formatRupiah } from "../utils/formatRupiah";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80";

function getCategoryName(product) {
  return (
    product?.Category?.name ||
    product?.category?.name ||
    (typeof product?.category === "string" ? product.category : "") ||
    "Kategori"
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAddedModal, setShowAddedModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetchProductById(id);

        if (!isMounted) return;
        setProduct(res.data);
      } catch (err) {
        if (!isMounted) return;
        setError("Produk tidak ditemukan.");
        setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  const imageUrl = useMemo(() => {
    if (!product?.image) return FALLBACK_IMAGE;
    return `http://localhost:5000/uploads/${product.image}`;
  }, [product?.image]);

  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (goToCart = false) => {
    if (!product) return;

    if (isOutOfStock) {
      setError("Stok produk sedang habis.");
      return;
    }

    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: getCategoryName(product),
      image: imageUrl,
      description: product.description,
      quantity,
    };

    addToCart(payload);

    if (goToCart) {
      navigate("/cart");
      return;
    }

    setShowAddedModal(true);
  };

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#f6f2ea]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15, 23, 42, 0.22) 2px, transparent 2px)",
            backgroundSize: "18px 18px",
            backgroundPosition: "0 0",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />

        <div className="relative mx-auto max-w-5xl px-5 py-10">
          <div className="animate-pulse grid gap-6 lg:grid-cols-2">
            <div className="h-[260px] rounded-[1.75rem] bg-white/70" />
            <div className="rounded-[1.75rem] border border-zinc-200 bg-white/75 p-5 shadow-sm backdrop-blur-sm">
              <div className="h-3 w-20 rounded bg-zinc-200" />
              <div className="mt-3 h-7 w-2/3 rounded bg-zinc-200" />
              <div className="mt-3 h-5 w-28 rounded bg-zinc-200" />
              <div className="mt-4 h-4 w-24 rounded bg-zinc-200" />
              <div className="mt-6 h-16 rounded bg-zinc-200" />
              <div className="mt-5 h-9 w-full rounded-2xl bg-zinc-200" />
              <div className="mt-3 h-9 w-full rounded-2xl bg-zinc-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#f6f2ea]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15, 23, 42, 0.22) 2px, transparent 2px)",
            backgroundSize: "18px 18px",
            backgroundPosition: "0 0",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />

        <div className="relative mx-auto max-w-5xl px-5 py-14">
          <div className="rounded-[1.75rem] border border-zinc-200 bg-white/85 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-rose-600">
              <BadgeAlert size={18} />
              <h1 className="text-lg font-bold">Produk tidak ditemukan</h1>
            </div>

            <p className="mt-2.5 text-sm text-zinc-600">
              Data produk yang kamu cari tidak tersedia atau sudah dihapus.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              <ArrowLeft size={14} />
              Kembali ke produk
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-[#f6f2ea]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15, 23, 42, 0.22) 2px, transparent 2px)",
            backgroundSize: "18px 18px",
            backgroundPosition: "0 0",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />

        <div className="relative mx-auto max-w-5xl px-5 py-8 lg:py-10">
          <Link
            to="/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900"
          >
            <ArrowLeft size={14} />
            Kembali
          </Link>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white/80 shadow-2xl backdrop-blur-md"
            >
              <div className="relative aspect-[4/5] w-full bg-zinc-100">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-[1.75rem] border border-zinc-200 bg-white/85 p-5 shadow-2xl backdrop-blur-md lg:p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                {getCategoryName(product)}
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 sm:text-[1.75rem]">
                {product.name}
              </h1>

              <p className="mt-2.5 text-lg font-bold text-zinc-900">
                {formatRupiah(product.price)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-sm">
                  <Truck size={12} />
                  Pengiriman cepat
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-sm">
                  <ShieldCheck size={12} />
                  Produk terpercaya
                </span>
              </div>

              <p
                className={`mt-4 text-sm font-medium ${
                  isOutOfStock ? "text-rose-600" : "text-zinc-500"
                }`}
              >
                Stok tersedia: {stock}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                {product.description || "Deskripsi produk belum tersedia."}
              </p>

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3.5">
                <p className="mb-2 text-sm font-semibold text-zinc-700">
                  Jumlah
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={isOutOfStock}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus size={13} />
                  </button>

                  <div className="min-w-11 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-center text-sm font-semibold text-zinc-900">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.min(stock, prev + 1))
                    }
                    disabled={isOutOfStock || quantity >= stock}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Tambah jumlah"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {isOutOfStock ? (
                  <p className="mt-2.5 text-sm font-medium text-rose-600">
                    Stok habis, produk tidak bisa dibeli.
                  </p>
                ) : (
                  <p className="mt-2.5 text-sm text-zinc-500">
                    Maksimal pembelian mengikuti stok yang tersedia.
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  disabled={isOutOfStock}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  <ShoppingCart size={15} />
                  Tambah ke Keranjang
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={isOutOfStock}
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Beli Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showAddedModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
              onClick={() => setShowAddedModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 12, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-2xl"
              >
                <button
                  onClick={() => setShowAddedModal(false)}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="Tutup modal"
                >
                  <X size={16} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={30} />
                  </div>

                  <h2 className="mt-4 text-xl font-black tracking-tight text-zinc-900">
                    Produk berhasil ditambahkan
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    Produk sudah masuk ke keranjang belanja kamu.
                  </p>

                  <button
                    onClick={() => setShowAddedModal(false)}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
                  >
                    Oke
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
