import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";

function Divisions() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDivisions = async () => {
    try {
      const response = await api.get("/divisions");
      setDivisions(response.data);
    } catch (error) {
      console.error("Error loading divisions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Division Name" },
    {
      key: "department",
      label: "Department",
      render: (row) => row.department?.name || "-",
    },
    {
      key: "manager",
      label: "Manager",
      render: (row) => row.manager?.fullName || "-",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Divisions"
        subtitle="List of all divisions in the organisation"
      />

      {loading ? <Loading /> : <DataTable columns={columns} data={divisions} />}
    </div>
  );
}

export default Divisions;