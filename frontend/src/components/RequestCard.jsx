import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { Calendar, User, Briefcase, Clock, FileText, ChevronRight, Check, X } from "lucide-react";

function RequestCard({ request, showActions = false, onApprove, onReject }) {
  return (
    <div className="glass-card p-6 flex flex-col h-full group hover:shadow-amber-500/5 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors duration-300">
            {request.leaveType?.name || "Demande de congé"}
          </h3>
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 w-fit">
            <Calendar size={12} className="text-amber-500/70" />
            <span>{request.startDate} — {request.endDate}</span>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="flex-grow space-y-3 mb-8">
        {[
          { icon: User, label: "Employé", value: request.employee?.user?.fullName },
          { icon: Briefcase, label: "Département", value: request.employee?.department?.name },
          { icon: Clock, label: "Durée", value: `${request.numberOfDays} Jours`, isHighlighted: true },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
            <div className="flex items-center gap-2 text-stone-500">
              <item.icon size={14} />
              <span className="font-medium text-xs uppercase tracking-tight">{item.label}</span>
            </div>
            <span className={`font-bold truncate max-w-[150px] ${item.isHighlighted ? 'text-amber-400' : 'text-stone-200'}`}>
              {item.value || "-"}
            </span>
          </div>
        ))}
        
        <div className="pt-3 px-4 py-3 bg-white/[0.03] rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-2">
            <FileText size={12} />
            <span>Motif</span>
          </div>
          <p className="text-stone-400 italic text-xs leading-relaxed line-clamp-2">
             {request.reason ? `"${request.reason}"` : "Aucun motif fourni."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <Link 
          to={`/leave-request-details/${request.id}`} 
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-all group/btn"
        >
          Voir tous les détails
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        {showActions && (
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
              onClick={() => onApprove(request.id)}
            >
              <Check size={16} />
              Approuver
            </button>
            <button 
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
              onClick={() => onReject(request.id)}
            >
              <X size={16} />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestCard;