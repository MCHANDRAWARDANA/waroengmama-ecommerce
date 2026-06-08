import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f6f2ea]">
      {/* Dotted background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15, 23, 42, 0.22) 2px, transparent 2px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Soft overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />

      <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-xl rounded-[2rem] border border-zinc-200 bg-white/85 p-10 text-center shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="mx-auto text-emerald-700" size={80} />

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Pesanan Berhasil
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">
            Terima kasih sudah berbelanja
          </h1>

          <p className="mt-4 text-zinc-600">
            Pesanan kamu berhasil dibuat dan sedang diproses.
          </p>

          <div className="mt-8 rounded-2xl bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">ID Order</p>
            <p className="mt-2 text-lg font-bold text-zinc-900">{id}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Belanja Lagi
            </Link>

            <Link
              to="/orders"
              className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Lihat Pesanan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
