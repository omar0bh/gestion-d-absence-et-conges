import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Service Name" },
    {
      key: "division",
      label: "Division",
      render: (row) => row.division?.name || "-",
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
        title="Services"
        subtitle="List of all services in the organisation"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Services List</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={services} />
        )}
      </div>
    </div>
  );
}

export default Services;