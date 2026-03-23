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
      label: "Leave Type",
      render: (row) => row.leaveType?.name || "-",
    },
    { key: "year", label: "Year" },
    { key: "remainingDays", label: "Remaining Days" },
  ];

  return (
    <div>
      <PageHeader
        title="My Leave Balances"
        subtitle="Remaining leave days for your account"
      />
      {loading ? <Loading /> : <DataTable columns={columns} data={balances} />}
    </div>
  );
}

export default LeaveBalances;