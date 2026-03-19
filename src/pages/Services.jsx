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
    <div>
      <PageHeader
        title="Services"
        subtitle="List of all services in the organisation"
      />

      {loading ? <Loading /> : <DataTable columns={columns} data={services} />}
    </div>
  );
}

export default Services;