import { useState, useEffect } from "react";
import { MessageSquareReply, X } from "lucide-react";

function RejectModal({ isOpen, title, message, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1a1614] border border-[#3d312a] rounded-2xl shadow-2xl p-0 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3d312a] bg-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/10 text-rose-400 p-2 rounded-lg border border-rose-500/20">
              <MessageSquareReply size={20} />
            </div>
            <h3 className="text-lg font-bold text-stone-100 uppercase tracking-tight">
              {title}
            </h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-stone-500 hover:text-stone-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-stone-400 text-sm mb-6 leading-relaxed bg-[#2a2420] p-4 rounded-xl border border-[#3d312a]/50">
            {message}
          </p>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">
              Motif du rejet <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Veuillez expliquer pourquoi cette demande est refusée..."
              className="w-full h-32 px-4 py-3 bg-stone-900 border border-[#3d312a] rounded-xl focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 text-stone-100 placeholder-stone-600 transition-all resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="py-3 px-8 rounded-xl text-sm font-bold text-stone-300 bg-transparent hover:bg-stone-800 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="py-3 px-10 rounded-xl text-sm font-black uppercase tracking-widest text-rose-50 text-[#9b2c2c] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-900/10"
          >
            Confirmer le rejet
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectModal;
