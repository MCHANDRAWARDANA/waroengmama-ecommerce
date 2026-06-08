import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import SuccessModal from "../components/SuccessModal";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Nama, email, dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      setShowModal(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

        <div className="relative flex min-h-screen items-center justify-center px-5 py-20">
          <div className="w-full max-w-md rounded-[2rem] border border-zinc-200 bg-white/85 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center rounded-full border border-zinc-300 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700 shadow-sm">
                WaroengMAMA
              </span>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">
                Daftar
              </h1>

              <p className="mt-3 text-sm text-zinc-600">
                Buat akun baru WaroengMAMA
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Nama"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-900 py-3 font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Daftar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-semibold text-zinc-900">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>

      {showModal && (
        <SuccessModal
          title="Daftar Berhasil"
          message="Akun Anda telah berhasil dibuat. Silakan login sekarang."
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
