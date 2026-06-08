import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { fetchProducts, fetchCategories } from "../services/productService";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);

        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts({ search, category, limit: 1000 }),
          fetchCategories(),
        ]);

        const normalizedProducts =
          productsRes?.data?.data ?? productsRes?.data ?? [];
        const normalizedCategories =
          categoriesRes?.data?.data ?? categoriesRes?.data ?? [];

        setProducts(
          Array.isArray(normalizedProducts) ? normalizedProducts : [],
        );
        setCategories(
          Array.isArray(normalizedCategories) ? normalizedCategories : [],
        );
        setError("");
      } catch {
        setError("Gagal memuat data produk.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [search, category]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "price-asc") {
      return result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f6f2ea] py-0">
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

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-6">
        <div className="mb-5">
          <p className="mb-2 inline-flex rounded-full border border-zinc-300 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700 shadow-sm backdrop-blur">
            Katalog Produk
          </p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-4xl">
            Semua Produk WaroengMAMA
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Cari kebutuhan harian, sembako, snack, minuman, kebersihan, dll
            dalam satu tempat.
          </p>
        </div>

        <div className="mb-5 grid gap-2 rounded-[1.25rem] border border-zinc-200 bg-white/85 p-3 shadow-sm backdrop-blur md:grid-cols-3">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900"
          >
            <option value="">Semua Kategori</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900"
          >
            <option value="default">Urutkan Default</option>
            <option value="price-asc">Harga Termurah</option>
            <option value="price-desc">Harga Termahal</option>
          </select>
        </div>

        {loading && (
          <div className="rounded-[1.25rem] border border-zinc-200 bg-white/85 p-6 text-center shadow-sm backdrop-blur">
            <p className="text-slate-600">Memuat produk...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-[1.25rem] border border-red-200 bg-red-50 p-3.5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan{" "}
                <span className="font-semibold">
                  {sortedProducts.length === 0 ? 0 : startIndex + 1}-
                  {Math.min(endIndex, sortedProducts.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold">{sortedProducts.length}</span>{" "}
                produk
              </p>
              <p className="text-sm text-slate-600">
                Halaman <span className="font-semibold">{currentPage}</span>{" "}
                dari{" "}
                <span className="font-semibold">{Math.max(totalPages, 1)}</span>
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="mt-6 rounded-[1.25rem] border border-zinc-200 bg-white/85 p-6 text-center shadow-sm backdrop-blur">
                <p className="text-slate-600">Produk tidak ditemukan.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2.5">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Sebelumnya
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Selanjutnya
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
