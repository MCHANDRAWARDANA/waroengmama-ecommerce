import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, Eye } from "lucide-react";
import { formatRupiah } from "../utils/formatRupiah";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 flex flex-col h-full"
    >
      <Link to={`/products/${product.id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="h-56 w-full object-cover"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {product.Category?.name ||
            (typeof product.category === "object"
              ? product.category?.name
              : product.category) ||
            "Kategori"}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2 min-h-14">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {formatRupiah(product.price)}
            </p>
            <p className="text-xs text-slate-500">Stok: {product.stock}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Eye size={14} />
            Beli
          </button>

          <button
            onClick={() => {
              const categoryName =
                product.Category?.name ||
                (typeof product.category === "object"
                  ? product.category?.name
                  : product.category) ||
                "";

              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: categoryName,
                image: imageUrl,
                description: product.description,
              });
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
          >
            <ShoppingCart size={14} />
            Tambah
          </button>
        </div>
      </div>
    </motion.div>
  );
}
