import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";

function LeaveRequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const requestRes = await api.get(`/leave-requests/${id}`);
        const approvalsRes = await api.get(`/leave-approvals/request/${id}`);

        setRequest(requestRes.data);
        setApprovals(approvalsRes.data || []);
      } catch (error) {
        console.error("Error loading request details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><Loading /></div>;

  if (!request) {
    return (
      <div className="flex flex-col gap-8 pb-12">
        <PageHeader title="Leave Request Details" subtitle="Request details" />
        <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-12 text-center text-stone-400 italic">
          Request not found.
        </div>
      </div>
    );
  }

  const approvalColumns = [
    { key: "levelOrder", label: "Order" },
    { key: "levelName", label: "Level" },
    { key: "approver", label: "Approver", render: (row) => row.approver?.fullName || "-" },
    { key: "decision", label: "Decision", render: (row) => (
      <span className={`font-bold ${row.decision === 'APPROVED' ? 'text-green-500' : row.decision === 'REJECTED' ? 'text-red-500' : 'text-amber-500'}`}>
        {row.decision}
      </span>
    )},
    { key: "comment", label: "Comment", render: (row) => <span className="text-stone-400 italic">"{row.comment || "-"}"</span> },
    { key: "decidedAt", label: "Date", render: (row) => row.decidedAt ? new Date(row.decidedAt).toLocaleDateString() : "-" }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Leave Request Details"
        subtitle="Detailed view of the request and its validation history"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-4 text-stone-300">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-stone-500 font-medium">Employee</span>
              <span className="text-stone-100 font-semibold">{request.employee?.user?.fullName || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-stone-500 font-medium">Role</span>
              <span className="text-stone-100">{request.employee?.user?.role || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-stone-500 font-medium">Leave Type</span>
              <span className="bg-[#4a3b32]/50 text-amber-200 px-2 py-0.5 rounded border border-[#5c493d]/50 text-sm font-medium">
                {request.leaveType?.name || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-stone-300">
             <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-stone-500 font-medium">Dates</span>
              <span className="text-stone-100 font-semibold">{request.startDate} → {request.endDate}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-stone-500 font-medium">Days</span>
              <span className="text-amber-500 font-bold">{request.numberOfDays || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-stone-500 font-medium">Status</span>
              <StatusBadge status={request.status} />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Reason for Request</h4>
          <p className="text-stone-200 italic leading-relaxed">"{request.reason || "No reason provided."}"</p>
        </div>
      </div>

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm flex items-center gap-2">
           <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Validation History
        </h3>

        {approvals.length === 0 ? (
          <div className="text-center py-12 text-stone-500 italic">
            No approvals recorded yet.
          </div>
        ) : (
          <DataTable columns={approvalColumns} data={approvals} />
        )}
      </div>
    </div>
  );
}

export default LeaveRequestDetails;