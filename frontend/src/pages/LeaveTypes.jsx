import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";

function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await api.get("/leave-types");
        setLeaveTypes(response.data);
      } catch (error) {
        console.error("Error loading leave types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "maxDays", label: "Max Days" },
    {
      key: "requiresProof",
      label: "Requires Proof",
      render: (row) => (row.requiresProof ? "Yes" : "No"),
    },
    {
      key: "requiresDirectorApproval",
      label: "Director Approval",
      render: (row) => (row.requiresDirectorApproval ? "Yes" : "No"),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Leave Types"
        subtitle="List of all leave and absence types"
      />
      {loading ? <Loading /> : <DataTable columns={columns} data={leaveTypes} />}
    </div>
  );
}

export default LeaveTypes;