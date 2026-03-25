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
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Divisions"
        subtitle="List of all divisions in the organisation"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Divisions List</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={divisions} />
        )}
      </div>
    </div>
  );
}

export default Divisions;