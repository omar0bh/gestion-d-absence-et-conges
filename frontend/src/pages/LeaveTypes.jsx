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
    { key: "name", label: "Nom" },
    { key: "description", label: "Description" },
    { key: "maxDays", label: "Jours Max" },
    {
      key: "requiresProof",
      label: "Justificatif Requis",
      render: (row) => (row.requiresProof ? "Oui" : "Non"),
    },
    {
      key: "requiresDirectorApproval",
      label: "Approbation Directeur",
      render: (row) => (row.requiresDirectorApproval ? "Oui" : "Non"),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Types de congé"
        subtitle="Liste de tous les types de congé et d'absence"
      />
      {loading ? <Loading /> : <DataTable columns={columns} data={leaveTypes} />}
    </div>
  );
}

export default LeaveTypes;