import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function normalizeArrayResponse(response, fallbackKeys = []) {
  const data = response?.data;

  if (Array.isArray(data)) return data;

  for (const key of fallbackKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function getCategoryId(product) {
  return (
    product?.categoryId ??
    product?.category_id ??
    product?.Category?.id ??
    product?.category?.id ??
    ""
  );
}

function getCategoryName(product) {
  return (
    product?.Category?.name ??
    product?.category?.name ??
    product?.categoryName ??
    product?.category_name ??
    "-"
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const ITEMS_PER_PAGE = 20;

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsRes, categoriesRes] = await Promise.all([
        fetchProducts({ limit: 1000 }),
        fetchCategories(),
      ]);

      const productsData = normalizeArrayResponse(productsRes, [
        "products",
        "rows",
        "items",
      ]);

      const categoriesData = normalizeArrayResponse(categoriesRes, [
        "categories",
        "rows",
        "items",
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (_error) {
      toast.error("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return products.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      return name.includes(keyword);
    });
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      categoryId: "",
    });
    setImageFile(null);
    setOpenModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product?.name || "",
      price: product?.price ?? "",
      stock: product?.stock ?? "",
      description: product?.description || "",
      categoryId: String(getCategoryId(product) || ""),
    });
    setImageFile(null);
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      toast.error("Field wajib belum lengkap");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description || "");
      formData.append("categoryId", form.categoryId);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Produk berhasil diperbarui");
      } else {
        await createProduct(formData);
        toast.success("Produk berhasil ditambahkan");
      }

      setOpenModal(false);
      setEditingProduct(null);
      setImageFile(null);
      setCurrentPage(1);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus produk ini?");
    if (!confirmDelete) return;

    try {
      setSubmitting(true);
      await deleteProduct(id);
      toast.success("Produk berhasil dihapus");
      setCurrentPage(1);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal hapus produk");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Kelola Produk</h1>
          <p className="mt-2 text-slate-600">
            Tambah, edit, hapus, dan upload produk warung.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          <Plus size={18} />
          Tambah Produk
        </button>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Memuat produk...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Foto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Harga
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Stok
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <img
                      src={
                        item?.image
                          ? `${API_BASE_URL}/uploads/${item.image}`
                          : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={item?.name || "Produk"}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item?.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {getCategoryName(item)}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    Rp {Number(item?.price || 0).toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4 text-slate-600">{item?.stock ?? 0}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Produk tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={18} />
            Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = currentPage === page;
              const isNear = Math.abs(currentPage - page) <= 1;

              if (!isNear && totalPages > 5) return null;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-xl px-3 py-2 font-semibold transition ${
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Selanjutnya
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(false)}
          />

          <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingProduct ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="rounded-xl p-2 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="Contoh: Indomie Goreng"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Kategori
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id ?? cat.categoryId ?? cat._id}
                        value={String(cat.id ?? cat.categoryId ?? cat._id ?? "")}
                      >
                        {cat.name ?? cat.categoryName ?? cat.title ?? "Kategori"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="3500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                  placeholder="Deskripsi produk..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gambar Produk
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 px-4 py-4 transition hover:bg-slate-50">
                  <Upload size={18} className="text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {imageFile ? imageFile.name : "Klik untuk upload gambar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}