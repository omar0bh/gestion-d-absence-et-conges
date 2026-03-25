import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import LeaveTypeForm from "../components/LeaveTypeForm";
import DataTable from "../components/DataTable";

function LeaveTypesManagement() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get("/leave-types");
      setLeaveTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "name", 
      label: "Name", 
      render: (row) => <span className="font-semibold text-stone-100">{row.name}</span> 
    },
    { key: "description", label: "Description", render: (row) => row.description || "-" },
    { 
      key: "maxDays", 
      label: "Max Days",
      render: (row) => <span className="font-bold text-amber-500">{row.maxDays}</span>
    },
    { 
      key: "requiresProof", 
      label: "Requires Proof",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.requiresProof ? 'bg-amber-950/40 text-amber-400 border-amber-800/50' : 'bg-zinc-800/40 text-zinc-500 border-zinc-700/50'}`}>
          {row.requiresProof ? "YES" : "NO"}
        </span>
      )
    },
    { 
      key: "requiresDirectorApproval", 
      label: "Director Approval",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.requiresDirectorApproval ? 'bg-amber-950/40 text-amber-400 border-amber-800/50' : 'bg-zinc-800/40 text-zinc-500 border-zinc-700/50'}`}>
          {row.requiresDirectorApproval ? "YES" : "NO"}
        </span>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Leave Types Management"
        subtitle="Create and manage leave and absence types"
      />

      <LeaveTypeForm onLeaveTypeCreated={fetchLeaveTypes} />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Leave Types List</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={leaveTypes} />
        )}
      </div>
    </div>
  );
}

export default LeaveTypesManagement;