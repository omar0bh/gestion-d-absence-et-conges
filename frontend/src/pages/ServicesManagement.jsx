import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ServiceForm from "../components/ServiceForm";
import DataTable from "../components/DataTable";

function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const columns = [
    { 
      key: "name", 
      label: "Service", 
      render: (row) => <span className="font-bold text-white">{row.name}</span> 
    },
    { key: "division", label: "Division", render: (row) => row.division?.name || "-" },
    { 
      key: "manager", 
      label: "Responsable", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-stone-200">{row.manager?.fullName || "Non Assigné"}</span>
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
        title="Services"
        subtitle="Gestion opérationnelle des services"
      />

      <ServiceForm onServiceCreated={fetchServices} />

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          Services Enregistrés
        </h3>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={services} />
        )}
      </div>
    </div>
  );
}

export default ServicesManagement;