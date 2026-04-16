import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import RequestCard from "../components/RequestCard";
import RejectModal from "../components/RejectModal";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

function RequestsToValidate() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, requestId: null });

  const loadRequests = async () => {
    try {
      const response = await api.get("/leave-requests");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const targetStatusByRole = {
    SERVICE_MANAGER: "PENDING_SERVICE",
    DIVISION_MANAGER: "PENDING_DIVISION",
    DEPARTMENT_MANAGER: "PENDING_DEPARTMENT",
    HR: "PENDING_HR",
    DIRECTOR: "PENDING_DIRECTOR",
  };

  const filteredRequests = useMemo(() => {
    if (!user?.role) return [];

    const targetStatus = targetStatusByRole[user.role];
    if (!targetStatus) return [];

    return requests.filter((request) => request.status === targetStatus);
  }, [requests, user]);

  const handleApprove = async (requestId) => {
    try {
      await api.post(`/leave-requests/${requestId}/approve`, {
        approverUserId: user.userId,
        comment: `Approved by ${user.fullName}`,
      });

      loadRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Approve failed."
      );
    }
  };

  const handleReject = (requestId) => {
    setRejectModal({ isOpen: true, requestId });
  };

  const confirmReject = async (comment) => {
    if (!rejectModal.requestId) return;

    try {
      await api.post(`/leave-requests/${rejectModal.requestId}/reject`, {
        approverUserId: user.userId,
        comment,
      });

      loadRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Reject failed."
      );
    } finally {
      setRejectModal({ isOpen: false, requestId: null });
    }
  };

  const canValidate = [
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ].includes(user?.role);

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Demandes à valider"
        subtitle="Demandes de congé en attente de votre validation"
      />

      {!canValidate ? (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 text-rose-500">
            <ShieldAlert size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight text-shadow-sm">Accès restreint</h3>
            <p className="text-stone-400 max-w-sm mx-auto text-sm leading-relaxed">
              Votre rôle actuel ({user?.role?.replace("_", " ")}) ne possède pas les permissions nécessaires pour valider les demandes de congé.
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-20">
          <Loading />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Tout est à jour !</h3>
            <p className="text-stone-400 max-w-sm mx-auto text-sm leading-relaxed">
              Félicitations ! Il n'y a aucune demande de congé en attente de votre validation. Profitez de votre temps de travail concentré.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      <RejectModal
        isOpen={rejectModal.isOpen}
        title="Rejet de la demande"
        message="Veuillez fournir un motif pour justifier le refus de cette demande de congé. Ce motif sera visible par l'employé."
        onConfirm={confirmReject}
        onCancel={() => setRejectModal({ isOpen: false, requestId: null })}
      />
    </div>
  );
}

export default RequestsToValidate;