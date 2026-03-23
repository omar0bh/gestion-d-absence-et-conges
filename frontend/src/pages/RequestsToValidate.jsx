import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import RequestCard from "../components/RequestCard";
import { useAuth } from "../context/AuthContext";

function RequestsToValidate() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const response = await api.get("/leave-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error loading requests to validate:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (!user?.role) return [];

    const statusByRole = {
      SERVICE_MANAGER: "PENDING_SERVICE",
      DIVISION_MANAGER: "PENDING_DIVISION",
      DEPARTMENT_MANAGER: "PENDING_DEPARTMENT",
      HR: "PENDING_HR",
      DIRECTOR: "PENDING_DIRECTOR",
    };

    const targetStatus = statusByRole[user.role];
    if (!targetStatus) return [];

    return requests.filter((request) => request.status === targetStatus);
  }, [requests, user]);

  const handleApprove = async (requestId) => {
    try {
      await api.post(`/leave-requests/${requestId}/approve`, {
        approverUserId: user.userId,
        comment: "Approved from frontend",
      });
      loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed.");
    }
  };

  const handleReject = async (requestId) => {
    const comment = window.prompt("Enter rejection reason:");
    if (comment === null) return;

    try {
      await api.post(`/leave-requests/${requestId}/reject`, {
        approverUserId: user.userId,
        comment,
      });
      loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Requests To Validate"
        subtitle="Leave requests pending your validation"
      />

      {loading ? (
        <Loading />
      ) : filteredRequests.length === 0 ? (
        <p className="bg-white rounded-[14px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-5 text-gray-500 text-center">No pending requests for your role.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[18px]">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              showActions
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestsToValidate;