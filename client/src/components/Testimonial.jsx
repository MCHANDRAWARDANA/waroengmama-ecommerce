import { Link } from "react-router-dom";
import { Star, Quote, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Alya",
    role: "Pelanggan",
    text: "Belanjanya gampang banget. Produknya lengkap dan checkout-nya cepat.",
    initials: "A",
  },
  {
    name: "Raka",
    role: "Pelanggan",
    text: "Tampilannya rapi, enak dipakai, dan informasi produknya jelas.",
    initials: "R",
  },
  {
    name: "Nina",
    role: "Pelanggan",
    text: "WaroengMAMA cocok banget buat kebutuhan harian keluarga.",
    initials: "N",
  },
  {
    name: "Dimas",
    role: "Pelanggan",
    text: "Cari produk jadi lebih cepat karena kategorinya tertata rapi.",
    initials: "D",
  },
  {
    name: "Salsa",
    role: "Pelanggan",
    text: "Navigasinya mudah dimengerti, jadi belanja terasa lebih nyaman.",
    initials: "S",
  },
  {
    name: "Fajar",
    role: "Pelanggan",
    text: "Produk-produk yang ditampilkan terlihat jelas dan informatif.",
    initials: "F",
  },
  {
    name: "Maya",
    role: "Pelanggan",
    text: "Desainnya modern dan tidak bikin bingung saat mau pilih barang.",
    initials: "M",
  },
  {
    name: "Tio",
    role: "Pelanggan",
    text: "Proses checkout-nya cepat, cocok buat belanja kebutuhan sehari-hari.",
    initials: "T",
  },
  {
    name: "Rina",
    role: "Pelanggan",
    text: "Saya suka karena tampilannya bersih dan gampang dipahami.",
    initials: "R",
  },
  {
    name: "Bima",
    role: "Pelanggan",
    text: "WaroengMAMA terasa praktis dan membantu banget buat belanja rutin.",
    initials: "B",
  },
];

export default function Testimonial() {
  return (
    <section className="relative overflow-hidden bg-[#f6f2ea] py-16 md:py-20">
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
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700 shadow-sm backdrop-blur">
              Suara pelanggan
            </p>

            <h2 className="text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
              Dipakai, disukai, dan direkomendasikan
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 md:text-base">
              Lihat apa kata pelanggan tentang pengalaman belanja di WaroengMAMA
              — cepat, praktis, dan nyaman dipakai sehari-hari.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:min-w-[360px]">
            <div className="rounded-2xl border border-zinc-200 bg-white/85 p-4 shadow-sm backdrop-blur">
              <p className="text-2xl font-black text-zinc-900">4.9/5</p>
              <p className="mt-1 text-xs text-zinc-500">Rata-rata puas</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white/85 p-4 shadow-sm backdrop-blur">
              <p className="text-2xl font-black text-zinc-900">10</p>
              <p className="mt-1 text-xs text-zinc-500">Testimoni aktif</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white/85 p-4 shadow-sm backdrop-blur col-span-2 sm:col-span-1">
              <p className="text-2xl font-black text-zinc-900">Cepat</p>
              <p className="mt-1 text-xs text-zinc-500">Proses belanja</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="flex h-full flex-col rounded-[1.75rem] border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-700">
                  {item.initials}
                </div>
              </div>

              <div className="mt-5 flex-1">
                <Quote size={18} className="text-zinc-300" />
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  “{item.text}”
                </p>
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-4">
                <p className="font-semibold text-zinc-900">{item.name}</p>
                <p className="text-sm text-zinc-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Lihat produk favorit
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
