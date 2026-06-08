import { Check } from "lucide-react";

export default function SuccessModal({ title, message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="text-emerald-700" size={32} />
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-slate-900 mb-2">
          {title}
        </h2>

        <p className="text-center text-slate-600 mb-8">{message}</p>

        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 transition"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
