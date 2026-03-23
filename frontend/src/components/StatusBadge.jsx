function StatusBadge({ status }) {
  const bgColors = {
    PENDING_SERVICE: "bg-[#f59e0b]",
    PENDING_DIVISION: "bg-[#f59e0b]",
    PENDING_DEPARTMENT: "bg-[#f59e0b]",
    PENDING_HR: "bg-[#f59e0b]",
    PENDING_DIRECTOR: "bg-[#f59e0b]",
    APPROVED: "bg-[#16a34a]",
    REJECTED: "bg-[#dc2626]",
    CANCELLED: "bg-[#dc2626]",
  };
  const bgColor = bgColors[status] || "bg-gray-500";

  return <span className={`inline-block px-[12px] py-[7px] rounded-full text-xs font-bold text-white ${bgColor}`}>{status}</span>;
}

export default StatusBadge;