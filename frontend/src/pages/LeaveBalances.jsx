import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

function LeaveBalances() {
  const { employeeId } = useAuth();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!employeeId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/leave-balances/employee/${employeeId}`);
        setBalances(response.data);
      } catch (error) {
        console.error("Error loading leave balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [employeeId]);

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "leaveType",
      label: "Type de congé",
      render: (row) => row.leaveType?.name || "-",
    },
    { key: "year", label: "Année" },
    { key: "remainingDays", label: "Jours Restants" },
  ];

  return (
    <div>
      <PageHeader
        title="Mes Soldes de Congé"
        subtitle="Jours de congé restants pour votre compte"
      />
      {loading ? <Loading /> : <DataTable columns={columns} data={balances} />}
    </div>
  );
}

export default LeaveBalances;