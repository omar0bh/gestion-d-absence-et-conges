function StatusBadge({ status }) {
  const statusConfig = {
    APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    REJECTED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
    CANCELLED: { bg: "bg-stone-500/10", text: "text-stone-400", border: "border-stone-500/20" },
  };

  const config = statusConfig[status] || { 
    bg: "bg-amber-500/10", 
    text: "text-amber-400", 
    border: "border-amber-500/20" 
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      {status?.replace("_", " ")}
    </span>
  );
}


export default StatusBadge;