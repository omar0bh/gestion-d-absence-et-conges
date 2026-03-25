import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import UserForm from "../components/UserForm";
import DataTable from "../components/DataTable";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "fullName", 
      label: "Full Name", 
      render: (row) => (
        <span className="font-bold text-white">{row.fullName}</span>
      ) 
    },
    { key: "email", label: "Email" },
    { 
      key: "role", 
      label: "Role", 
      render: (row) => (
        <span className="bg-white/5 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-amber-500/20 uppercase tracking-widest">
          {row.role?.replace("_", " ")}
        </span>
      ) 
    },
    { 
      key: "active", 
      label: "Status", 
      render: (row) => (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${row.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
          {row.active ? "Active" : "Inactive"}
        </span>
      ) 
    },
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Users Management"
        subtitle="Manage system access and authentication"
      />

      <UserForm onUserCreated={fetchUsers} />

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          Registered Users
        </h3>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>
    </div>
  );
}

export default UsersManagement;