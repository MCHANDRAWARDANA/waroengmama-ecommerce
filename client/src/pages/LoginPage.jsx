import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import SuccessModal from "../components/SuccessModal";

export default function LoginPage() {
  const navigate = useNavigate();
  const { saveToken, fetchProfile } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      saveToken(res.data.accessToken);
      await fetchProfile();

      setModalData({
        title: "Login Berhasil",
        message: "Selamat datang kembali di WaroengMAMA!",
      });
      setShowModal(true);

      const role = res.data?.user?.role;

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal");
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
                Login
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                Masuk ke akun WaroengMAMA
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Belum punya akun?{" "}
              <Link to="/register" className="font-semibold text-zinc-900">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </section>

      {showModal && (
        <SuccessModal
          title={modalData.title}
          message={modalData.message}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
