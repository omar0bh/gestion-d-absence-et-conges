import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

function LeaveRequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const requestResponse = await api.get(`/leave-requests/${id}`);
        const approvalsResponse = await api.get(`/leave-approvals/request/${id}`);

        setRequest(requestResponse.data);
        setApprovals(approvalsResponse.data);
      } catch (error) {
        console.error("Error loading request details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Loading />;

  if (!request) return <p className="bg-white rounded-[14px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-5 text-gray-500 text-center">Request not found.</p>;

  return (
    <div>
      <PageHeader
        title="Leave Request Details"
        subtitle="Detailed view of one leave request"
      />

      <div className="bg-white rounded-[14px] p-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-[20px] text-gray-900">
        <p className="flex justify-between border-b border-gray-100 pb-3 mb-3 text-sm">
          <strong className="text-gray-500 tracking-wider text-xs uppercase">Employee:</strong> {request.employee?.user?.fullName || "-"}
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-3 mb-3 text-sm">
          <strong className="text-gray-500 tracking-wider text-xs uppercase">Leave Type:</strong> {request.leaveType?.name || "-"}
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-3 mb-3 text-sm">
          <strong className="text-gray-500 tracking-wider text-xs uppercase">Dates:</strong> {request.startDate} → {request.endDate}
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-3 mb-3 text-sm">
          <strong className="text-gray-500 tracking-wider text-xs uppercase">Days:</strong> {request.numberOfDays}
        </p>
        <div className="pb-3 mb-3 text-sm border-b border-gray-100">
          <strong className="block text-gray-500 tracking-wider text-xs uppercase mb-2">Reason:</strong> 
          <p className="bg-gray-50 p-3 rounded-xl border border-gray-200 min-h-[60px]">{request.reason || "-"}</p>
        </div>
        <p className="flex justify-between items-center text-sm">
          <strong className="text-gray-500 tracking-wider text-xs uppercase">Status:</strong> <StatusBadge status={request.status} />
        </p>
      </div>

      <div className="bg-white rounded-[14px] p-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-[20px] text-gray-900">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Approvals History</h3>

        {approvals.length === 0 ? (
          <p className="flex justify-center items-center py-8 px-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 italic">No approvals recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap">Order</th>
                  <th className="px-6 py-4 whitespace-nowrap">Level</th>
                  <th className="px-6 py-4 whitespace-nowrap">Approver</th>
                  <th className="px-6 py-4 whitespace-nowrap">Decision</th>
                  <th className="px-6 py-4 whitespace-nowrap">Comment</th>
                  <th className="px-6 py-4 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50 transition-colors duration-200 text-sm font-medium text-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">{approval.levelOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{approval.levelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{approval.approver?.fullName || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{approval.decision}</td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={approval.comment || "-"}>{approval.comment || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{approval.decidedAt || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveRequestDetails;