import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

export default function RequireAuthModal({ open, onClose, message }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const title = useMemo(() => {
    if (user) return "Aksi tersedia untuk akun";
    return "Login diperlukan";
  }, [user]);

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <div className="text-slate-700">
        <p className="leading-relaxed">
          {message || "Silakan login terlebih dahulu untuk melanjutkan."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            onClick={onClose}
            type="button"
          >
            Nanti
          </button>
          <button
            className="flex-1 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition"
            onClick={() => navigate("/login")}
            type="button"
          >
            Login
          </button>
        </div>
      </div>
    </Modal>
  );
}
