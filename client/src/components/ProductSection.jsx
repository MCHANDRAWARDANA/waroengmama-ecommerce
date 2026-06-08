import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart, Search, X, ChevronRight } from "lucide-react";
import { fetchProducts, fetchCategories } from "../services/productService";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../utils/formatRupiah";

export default function ProductSection() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts({ limit: 100 }),
          fetchCategories(),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (_error) {
        toast.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const imageUrl = (product) =>
    product?.image
      ? `http://localhost:5000/uploads/${product.image}`
      : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

  const filteredProducts = products.filter((product) => {
    const name = product?.name?.toLowerCase() || "";
    const categoryName = product?.Category?.name?.toLowerCase() || "";
    const keyword = searchTerm.toLowerCase();
    return name.includes(keyword) || categoryName.includes(keyword);
  });

  const productsByCategory = categories
    .map((cat) => ({
      category: cat,
      products: filteredProducts.filter((p) => p.categoryId === cat.id),
    }))
    .filter((group) => group.products.length > 0);

  return (
    <section className="relative overflow-hidden bg-[#f6f2ea] py-14">
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

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700 shadow-sm backdrop-blur">
              Koleksi produk
            </p>

            <h2 className="text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
              Pilihan terbaik untuk kebutuhan harian
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 md:text-base">
              Temukan produk favorit, stok harian, dan kebutuhan rumah tangga
              dalam tampilan yang rapi, cepat, dan mudah dicari.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk atau kategori..."
                className="w-full rounded-2xl border border-zinc-300 bg-white/85 py-3 pl-11 pr-10 text-sm text-zinc-700 outline-none shadow-sm backdrop-blur transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-300 bg-white/85 px-5 py-3 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Lihat semua
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-zinc-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur">
            <p className="text-zinc-600">Memuat produk...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {productsByCategory.map(
              ({ category, products: categoryProducts }) => (
                <div key={category.id}>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 md:text-2xl">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {categoryProducts.length} produk tersedia
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {categoryProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white/85 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <Link to={`/products/${item.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={imageUrl(item)}
                              alt={item.name}
                              className="h-full w-full object-cover transition duration-500 hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 shadow-sm backdrop-blur">
                              {item.Category?.name || "Produk"}
                            </div>
                          </div>
                        </Link>

                        <div className="flex flex-1 flex-col p-3.5">
                          <Link to={`/products/${item.id}`}>
                            <h4 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-zinc-900 transition hover:text-zinc-700">
                              {item.name}
                            </h4>
                          </Link>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-sm font-black text-emerald-700">
                              {formatRupiah(item.price)}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                              Stok: {item.stock ?? 0}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                stock: item.stock,
                                category: item.Category?.name,
                                image: imageUrl(item),
                                description: item.description,
                              })
                            }
                            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800"
                          >
                            <ShoppingCart size={14} />
                            Tambah ke keranjang
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {!loading && productsByCategory.length === 0 && (
          <div className="rounded-[2rem] border border-zinc-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur">
            <p className="text-zinc-600">
              {searchTerm
                ? "Produk tidak ditemukan. Coba kata kunci lain."
                : "Belum ada produk yang ditampilkan."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
