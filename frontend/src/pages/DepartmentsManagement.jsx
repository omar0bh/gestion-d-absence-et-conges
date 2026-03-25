import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import DepartmentForm from "../components/DepartmentForm";
import DataTable from "../components/DataTable";

function DepartmentsManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const columns = [
    { 
      key: "name", 
      label: "Department", 
      render: (row) => <span className="font-bold text-white">{row.name}</span> 
    },
    { 
      key: "manager", 
      label: "Manager", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-stone-200">{row.manager?.fullName || "Not Assigned"}</span>
          <span className="text-[10px] text-stone-500 uppercase tracking-widest">{row.manager?.role?.replace("_", " ") || "-"}</span>
        </div>
      ) 
    },
    { 
      key: "email", 
      label: "Contact", 
      render: (row) => <span className="text-stone-400 text-xs">{row.manager?.email || "-"}</span>
    },
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Departments"
        subtitle="Organize and manage structural departments"
      />

      <DepartmentForm onDepartmentCreated={fetchDepartments} />

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          Registered Departments
        </h3>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={departments} />
        )}
      </div>
    </div>
  );
}

export default DepartmentsManagement;