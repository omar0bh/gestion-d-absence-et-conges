import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";

export default function LeaveBalancesManagement() {
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    year: new Date().getFullYear(),
    remainingDays: ""
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const [empRes, typeRes, balRes] = await Promise.all([
        api.get("/employees"),
        api.get("/leave-types"),
        api.get("/leave-balances")
      ]);
      setEmployees(empRes.data || []);
      setLeaveTypes(typeRes.data || []);
      setBalances(balRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/leave-balances", {
        employeeId: Number(form.employeeId),
        leaveTypeId: Number(form.leaveTypeId),
        year: Number(form.year),
        remainingDays: Number(form.remainingDays)
      });
      
      setMessage("Balance created successfully!");
      setForm({
        employeeId: "",
        leaveTypeId: "",
        year: new Date().getFullYear(),
        remainingDays: ""
      });
      fetchData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error creating balance.");
    }
  };

  const columns = [
    { 
      key: "employee", 
      label: "Employee", 
      render: (row) => (
        <span className="font-semibold text-stone-100">
          {row.employee?.user?.fullName || "Unknown"}
        </span>
      ) 
    },
    { 
      key: "leaveType", 
      label: "Leave Type", 
      render: (row) => row.leaveType?.name || "-" 
    },
    { key: "year", label: "Year" },
    { 
      key: "remainingDays", 
      label: "Remaining",
      render: (row) => (
        <span className="font-bold text-amber-500">{row.remainingDays}</span>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader 
        title="Leave Balances" 
        subtitle="Manage employee leave quotas and yearly balances" 
      />

      {/* FORM CARD */}
      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Attribute Balance</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Employee</label>
              <div className="relative">
                <select 
                  name="employeeId" 
                  value={form.employeeId} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
                >
                  <option value="" className="bg-zinc-900 text-stone-400">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id} className="bg-zinc-900 text-stone-100">
                      {e.user?.fullName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Leave Type</label>
              <div className="relative">
                <select 
                  name="leaveTypeId" 
                  value={form.leaveTypeId} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
                >
                  <option value="" className="bg-zinc-900 text-stone-400">Select Leave Type</option>
                  {leaveTypes.map(l => (
                    <option key={l.id} value={l.id} className="bg-zinc-900 text-stone-100">
                      {l.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Year</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Year"
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Remaining Days</label>
              <input
                type="number"
                name="remainingDays"
                value={form.remainingDays}
                onChange={handleChange}
                placeholder="Remaining Days"
                required
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
              />
            </div>

          </div>

          {message && (
            <div className="bg-green-950/40 border border-green-800/50 text-green-300 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {message}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-950/40 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button 
              type="submit"
              className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
            >
              Create Balance
            </button>
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Current Balances</h3>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={balances} />
        )}
      </div>
    </div>
  );
}