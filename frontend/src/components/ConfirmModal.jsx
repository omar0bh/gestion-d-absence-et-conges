import { AlertTriangle } from "lucide-react";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="bg-rose-500/10 text-rose-500 p-3 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-stone-100 mb-2">
              {title}
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="py-2.5 px-6 rounded-xl text-sm font-bold text-stone-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600/50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="py-2.5 px-6 rounded-xl text-sm font-bold text-rose-100 bg-rose-600/90 hover:bg-rose-500 border border-rose-500/50 transition-colors shadow-lg shadow-rose-900/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
