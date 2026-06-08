import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Package2,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

export default function Hero() {
  const highlights = [
    {
      icon: Truck,
      title: "Antar cepat",
      desc: "Pesanan diproses lebih ringkas.",
    },
    {
      icon: BadgeCheck,
      title: "Aman & rapi",
      desc: "Belanja nyaman dan terpercaya.",
    },
    {
      icon: Package2,
      title: "Produk lengkap",
      desc: "Sembako, snack, dan kebutuhan rumah.",
    },
  ];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#f6f2ea]">
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

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 py-4 lg:py-5">
        {/* Main hero content */}
        <div className="grid flex-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left side */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700 shadow-sm backdrop-blur">
              <ShoppingBag size={12} />
              WaroengMAMA
            </span>

            <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Semua kebutuhan harian,
              <span className="mt-2 block text-zinc-700">
                lebih cepat, lebih mudah, lebih dekat.
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-600 sm:text-base">
              Belanja sembako, minuman, snack, kebutuhan bayi, hingga gas LPG
              dalam satu tempat yang simpel, nyaman, dan siap bantu kebutuhan
              rumah kamu.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                Belanja Sekarang
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white/85 px-5 py-3 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              >
                Lihat Pesanan
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white/85 p-3.5 shadow-sm backdrop-blur">
                <p className="text-xl font-black text-zinc-900">100+</p>
                <p className="mt-1 text-xs text-zinc-500">Produk kebutuhan</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/85 p-3.5 shadow-sm backdrop-blur">
                <p className="text-xl font-black text-zinc-900">Cepat</p>
                <p className="mt-1 text-xs text-zinc-500">Proses checkout</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/85 p-3.5 shadow-sm backdrop-blur">
                <p className="text-xl font-black text-zinc-900">24/7</p>
                <p className="mt-1 text-xs text-zinc-500">Siap kapan saja</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
                <Clock3 size={14} className="text-zinc-900" />
                Order diproses cepat
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
                <Star size={14} className="text-zinc-900" />
                Produk favorit pelanggan
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="relative">
            <div className="absolute -left-4 top-8 h-16 w-16 rounded-full bg-zinc-900/10 blur-2xl" />
            <div className="absolute -right-6 bottom-10 h-24 w-24 rounded-full bg-zinc-900/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white/80 p-3 shadow-2xl backdrop-blur">
              <img
                src="https://i.pinimg.com/736x/aa/b6/7e/aab67ee22f84fa401e100ce50d26b00b.jpg"
                alt="Toko kelontong WaroengMAMA"
                className="h-[300px] w-full rounded-[1.5rem] object-cover sm:h-[340px] lg:h-[390px]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-2">
              </div>
            </div>

            {/* Bottom feature cards */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <Icon size={18} className="text-zinc-900" />
                    <p className="mt-2 text-sm font-bold text-zinc-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
