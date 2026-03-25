import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "matricule", label: "Matricule" },
    {
      key: "user",
      label: "Employee Name",
      render: (row) => row.user?.fullName || "-",
    },
    { key: "positionTitle", label: "Position" },
    {
      key: "department",
      label: "Department",
      render: (row) => row.department?.name || "-",
    },
    {
      key: "division",
      label: "Division",
      render: (row) => row.division?.name || "-",
    },
    {
      key: "service",
      label: "Service",
      render: (row) => row.service?.name || "-",
    },
    {
      key: "directManager",
      label: "Direct Manager",
      render: (row) => row.directManager?.fullName || "-",
    },
    { key: "hireDate", label: "Hire Date" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Employees"
        subtitle="List of all employees in the organisation"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Employees List</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={employees} />
        )}
      </div>
    </div>
  );
}

export default Employees;