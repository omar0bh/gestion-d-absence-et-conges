import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import EmployeeForm from "../components/EmployeeForm";
import DataTable from "../components/DataTable";

function EmployeesManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columns = [
    { key: "matricule", label: "Matricule" },
    { 
      key: "fullName", 
      label: "Full Name", 
      render: (row) => (
        <span className="font-bold text-white">{row.user?.fullName || "-"}</span>
      ) 
    },
    { 
      key: "role", 
      label: "Role", 
      render: (row) => (
        <span className="bg-white/5 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-amber-500/20 uppercase tracking-widest whitespace-nowrap">
          {row.user?.role?.replace("_", " ") || "-"}
        </span>
      ) 
    },
    { key: "positionTitle", label: "Position" },
    { key: "department", label: "Department", render: (row) => row.department?.name || "-" },
    { key: "hireDate", label: "Hire Date" },
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Employees Management"
        subtitle="Maintain and update organizational employee records"
      />

      <EmployeeForm onEmployeeCreated={fetchEmployees} />

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          Employee Directory
        </h3>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={employees} />
        )}
      </div>
    </div>
  );
}

export default EmployeesManagement;