import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Calendar from "./Calendar";
import { Clock, CheckCircle2, XCircle, Briefcase } from "lucide-react";

function EmployeeDashboard() {
  const { employeeId, user } = useAuth();
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!employeeId) return;

      try {
        const [balancesRes, requestsRes] = await Promise.all([
          api.get(`/leave-balances/employee/${employeeId}`),
          api.get(`/leave-requests/employee/${employeeId}`),
        ]);

        setBalances(balancesRes.data || []);
        setRequests(requestsRes.data || []);
      } catch (error) {
        console.error("Error loading employee dashboard data:", error);
      }
    };

    loadData();
  }, [employeeId]);

  const pendingCount = requests.filter((r) => r.status?.includes("PENDING")).length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-amber-500/50 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <Clock size={110} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Pending Requests</p>
              <h3 className="text-3xl font-bold text-white">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-emerald-500/50 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <CheckCircle2 size={110} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Approved Requests</p>
              <h3 className="text-3xl font-bold text-white">{approvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-red-500/50 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <XCircle size={110} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Rejected Requests</p>
              <h3 className="text-3xl font-bold text-white">{rejectedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/20">
              <XCircle size={20} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-blue-500/50 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <Briefcase size={110} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Active Leave Balances</p>
              <h3 className="text-3xl font-bold text-white">{balances.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Briefcase size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6">My Leave Balances</h3>

        {balances.length === 0 ? (
          <p className="text-stone-400">No balances found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-900/40 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Year</th>
                  <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Remaining Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {balances.map((balance) => (
                  <tr key={balance.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-300">{balance.leaveType?.name || "-"}</td>
                    <td className="px-6 py-4 text-stone-400">{balance.year}</td>
                    <td className="px-6 py-4 font-bold text-white">{balance.remainingDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-stone-500/20 rounded-3xl blur-2xl opacity-20 pointer-events-none"></div>
        <div className="relative">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;