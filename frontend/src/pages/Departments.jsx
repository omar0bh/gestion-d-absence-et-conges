import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error loading departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Department Name" },
    {
      key: "manager",
      label: "Manager",
      render: (row) => row.manager?.fullName || "-",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Departments"
        subtitle="List of all departments in the organisation"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Departments List</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={departments} />
        )}
      </div>
    </div>
  );
}

export default Departments;