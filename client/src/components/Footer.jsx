import { MapPin, Clock, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#18181b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="lg:w-1/4">
            <h2 className="text-2xl font-black tracking-tight">WaroengMAMA</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Semua Ada, Semua Dekat.
            </p>
          </div>

          <div className="lg:w-1/4">
            <div className="mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-zinc-400" />
              <h3 className="text-base font-semibold">Alamat</h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              Salem, Brebes, Jawa Tengah
              <br />
              Indonesia
            </p>
          </div>

          <div className="lg:w-1/4">
            <div className="mb-3 flex items-center gap-2">
              <Mail size={18} className="text-zinc-400" />
              <h3 className="text-base font-semibold">Hubungi Kami</h3>
            </div>

            <div className="mb-3 flex flex-col gap-2 text-sm text-zinc-300">
              <p>Email: hello@waroengmama.com</p>
              <p>WhatsApp: +62 812-3456-7890</p>
            </div>

            <div className="flex gap-3">
              <a
                href="mailto:hello@waroengmama.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                aria-label="WhatsApp"
              >
                <Phone size={18} />
              </a>

              <a
                href="https://instagram.com/waroengmama"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                aria-label="Instagram"
              >
                IG
              </a>
            </div>
          </div>

          <div className="lg:w-1/4">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={18} className="text-zinc-400" />
              <h3 className="text-base font-semibold">Jam Buka</h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              Senin - Minggu
              <br />
              08.00 - 22.00 WIB
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-center text-sm text-zinc-400">
            © 2026 WaroengMAMA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
