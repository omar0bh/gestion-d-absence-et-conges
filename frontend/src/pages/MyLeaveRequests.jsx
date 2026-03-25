import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import RequestCard from "../components/RequestCard";
import { useAuth } from "../context/AuthContext";
import { FileQuestion } from "lucide-react";

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
        setRequests(response.data || []);
      } catch (error) {
        console.error("Error loading my leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [employeeId]);

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="My Leave Requests"
        subtitle="Track your submitted leave and absence requests"
      />

      {loading ? (
        <div className="flex justify-center p-20">
          <Loading />
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 bg-stone-500/10 rounded-full flex items-center justify-center border border-white/5 text-stone-500">
            <FileQuestion size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">No Requests Found</h3>
            <p className="text-stone-400 max-w-sm mx-auto text-sm leading-relaxed">
              You haven't submitted any leave requests yet. Start by creating a new request from the navigation menu.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLeaveRequests;