import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import RequestCard from "../components/RequestCard";
import { useAuth } from "../context/AuthContext";

function MyLeaveRequests() {
  const { employeeId } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!employeeId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/leave-requests/employee/${employeeId}`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error loading my requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [employeeId]);

  return (
    <div>
      <PageHeader
        title="My Leave Requests"
        subtitle="Track all your submitted leave requests"
      />

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <p className="bg-white rounded-[14px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-5 text-gray-500 text-center">No leave requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[18px]">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLeaveRequests;