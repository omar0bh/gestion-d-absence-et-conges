import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Calendar as CalendarIcon,
  User,
  MoreHorizontal
} from "lucide-react";

function Calendar() {
  const { user, employeeId } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("ALL");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const isValidator = [
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ].includes(user?.role);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/leave-requests");
      setLeaveRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const scopedRequests = useMemo(() => {
    if (!user) return [];

    if (!isValidator) {
      return leaveRequests.filter((req) => req.employee?.id === employeeId);
    }

    if (user.role === "SERVICE_MANAGER") {
      return leaveRequests.filter(
        (req) => req.employee?.service?.manager?.id === user.userId
      );
    }

    if (user.role === "DIVISION_MANAGER") {
      return leaveRequests.filter(
        (req) => req.employee?.division?.manager?.id === user.userId
      );
    }

    if (user.role === "DEPARTMENT_MANAGER") {
      return leaveRequests.filter(
        (req) => req.employee?.department?.manager?.id === user.userId
      );
    }

    return leaveRequests;
  }, [leaveRequests, user, employeeId, isValidator]);

  const filteredRequests = useMemo(() => {
    return scopedRequests.filter((req) => {
      const start = new Date(req.startDate);
      const reqYear = start.getFullYear();
      const reqMonth = start.getMonth();

      const matchesMonth = reqYear === year && reqMonth === month;

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PENDING"
          ? req.status?.includes("PENDING")
          : req.status === statusFilter;

      const matchesType =
        leaveTypeFilter === "ALL"
          ? true
          : req.leaveType?.name === leaveTypeFilter;

      return matchesMonth && matchesStatus && matchesType;
    });
  }, [scopedRequests, year, month, statusFilter, leaveTypeFilter]);

  const leaveTypes = useMemo(() => {
    const unique = [...new Set(scopedRequests.map((r) => r.leaveType?.name).filter(Boolean))];
    return unique;
  }, [scopedRequests]);

  const getDaysInMonth = () => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return days;
  };

  const getRequestsForDay = (day) => {
    return filteredRequests.filter((req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const current = new Date(year, month, day);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);

      return current >= start && current <= end;
    });
  };

  const getStatusColorClass = (status) => {
    if (status === "APPROVED") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (status === "REJECTED") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (status?.includes("PENDING")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-stone-500/20 text-stone-400 border-stone-500/30";
  };

  const getLeaveTypeColorClass = (typeName) => {
    if (!typeName) return "border-stone-500";
    const name = typeName.toLowerCase();
    if (name.includes("annuel")) return "border-blue-500";
    if (name.includes("maladie")) return "border-purple-500";
    if (name.includes("absence")) return "border-amber-500";
    if (name.includes("exceptionnel")) return "border-teal-500";
    return "border-stone-400";
  };

  const days = getDaysInMonth();

  const summary = useMemo(() => {
    const pending = filteredRequests.filter((r) => r.status?.includes("PENDING")).length;
    const approved = filteredRequests.filter((r) => r.status === "APPROVED").length;
    const rejected = filteredRequests.filter((r) => r.status === "REJECTED").length;

    let overloadedDays = 0;
    for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
      const dayRequests = getRequestsForDay(d);
      const approvedCount = dayRequests.filter((r) => r.status === "APPROVED").length;
      if (approvedCount >= 3) overloadedDays++;
    }

    return { pending, approved, rejected, overloadedDays };
  }, [filteredRequests, year, month]);

  const warnings = useMemo(() => {
    if (!isValidator) return [];

    const items = [];
    const today = new Date();
    const next7 = new Date();
    next7.setDate(today.getDate() + 7);

    const pendingUpcoming = scopedRequests.filter((req) => {
      const start = new Date(req.startDate);
      return req.status?.includes("PENDING") && start >= today && start <= next7;
    });

    if (pendingUpcoming.length >= 3) {
      items.push(`Attention: ${pendingUpcoming.length} pending requests in the next 7 days.`);
    }

    const approvedUpcoming = scopedRequests.filter((req) => {
      const start = new Date(req.startDate);
      return req.status === "APPROVED" && start >= today && start <= next7;
    });

    const dailyCount = {};
    approvedUpcoming.forEach((req) => {
      let cursor = new Date(req.startDate);
      const end = new Date(req.endDate);
      cursor.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      while (cursor <= end) {
        const key = cursor.toISOString().split("T")[0];
        dailyCount[key] = (dailyCount[key] || 0) + 1;
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    Object.entries(dailyCount).forEach(([date, count]) => {
      if (count >= 3) {
        items.push(`Busy day detected: ${count} approved absences on ${date}.`);
      }
    });

    return items;
  }, [scopedRequests, isValidator]);

  const resetFilters = () => {
    setStatusFilter("ALL");
    setLeaveTypeFilter("ALL");
  };

  return (
    <div className="space-y-8">
      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 glass-card border-l-4 border-amber-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Pending</p>
              <h3 className="text-3xl font-bold text-white">{summary.pending}</h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="p-6 glass-card border-l-4 border-emerald-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Approved</p>
              <h3 className="text-3xl font-bold text-white">{summary.approved}</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        <div className="p-6 glass-card border-l-4 border-red-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Rejected</p>
              <h3 className="text-3xl font-bold text-white">{summary.rejected}</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <XCircle size={20} />
            </div>
          </div>
        </div>

        <div className="p-6 glass-card border-l-4 border-stone-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Busy Days</p>
              <h3 className="text-3xl font-bold text-white">{summary.overloadedDays}</h3>
            </div>
            <div className="p-2 bg-stone-500/10 rounded-lg text-stone-400">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {isValidator && warnings.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-amber-600 animate-pulse">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle size={18} />
            System Warnings
          </h3>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="text-sm text-stone-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Calendar Card */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-stone-400 hover:text-white border border-white/5"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white tracking-tight min-w-[150px] text-center capitalize">
              {currentDate.toLocaleString("default", { month: "long" })} <span className="text-amber-500/80">{year}</span>
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-stone-400 hover:text-white border border-white/5"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-stone-900/40 p-1 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/50 rounded-lg border border-white/5">
                <Filter size={14} className="text-stone-500" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-stone-300 outline-none cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/50 rounded-lg border border-white/5">
                <CalendarIcon size={14} className="text-stone-500" />
                <select 
                  value={leaveTypeFilter} 
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-stone-300 outline-none cursor-pointer"
                >
                  <option value="ALL">All Types</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-4 bg-stone-900/20 border-b border-white/5 flex flex-wrap gap-6">
          {[
            { label: "Approved", color: "bg-emerald-500" },
            { label: "Pending", color: "bg-amber-500" },
            { label: "Rejected", color: "bg-red-500" },
            { label: "Annuel", color: "bg-blue-500" },
            { label: "Maladie", color: "bg-purple-500" },
            { label: "Absence", color: "bg-amber-500" },
            { label: "Exceptionnel", color: "bg-teal-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="p-1">
          <div className="grid grid-cols-7 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-3 text-center text-[10px] font-black text-stone-600 uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const requests = day ? getRequestsForDay(day) : [];
              const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();
              const isSelected = selectedDay === day;

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDay(day)}
                  className={`min-h-[120px] p-2 rounded-xl transition-all duration-200 border relative group ${
                    day 
                      ? "bg-stone-800/20 border-white/5 hover:border-amber-500/30 cursor-pointer" 
                      : "bg-transparent border-transparent"
                  } ${isSelected ? "border-amber-500/50 bg-amber-500/5" : ""} ${isToday ? "ring-1 ring-amber-500 ring-inset" : ""}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-bold mb-2 ${isToday ? "text-amber-500" : "text-stone-500 group-hover:text-stone-300"}`}>
                        {day}
                      </div>

                      <div className="space-y-1">
                        {requests.slice(0, 3).map((req, i) => (
                          <div
                            key={i}
                            className={`text-[9px] px-1.5 py-0.5 rounded border border-l-4 font-bold truncate ${getStatusColorClass(req.status)} ${getLeaveTypeColorClass(req.leaveType?.name)}`}
                          >
                            {isValidator ? req.employee?.user?.fullName : req.leaveType?.name}
                          </div>
                        ))}
                        {requests.length > 3 && (
                          <div className="text-[9px] font-bold text-stone-500 text-center flex items-center justify-center gap-1 pt-1">
                            <MoreHorizontal size={10} />
                            {requests.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Table */}
      {selectedDay && (
        <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-stone-900/20">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Daily Details</h3>
              <p className="text-xs text-stone-500 font-medium">
                Showing absences for {selectedDay} {currentDate.toLocaleString("default", { month: "long" })} {year}
              </p>
            </div>
            <button 
              onClick={() => setSelectedDay(null)}
              className="p-2 hover:bg-white/5 rounded-lg text-stone-500 hover:text-white transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="overflow-x-auto">
            {getRequestsForDay(selectedDay).length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-stone-900/50 rounded-2xl flex items-center justify-center text-stone-600 mx-auto mb-4 border border-white/5">
                  <Clock size={32} />
                </div>
                <p className="text-stone-400 font-medium">No absences recorded for this day.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-950/40">
                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getRequestsForDay(selectedDay).map((req) => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-bold text-stone-200">{req.employee?.user?.fullName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-400 font-medium">{req.leaveType?.name || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColorClass(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-500 font-mono">
                        {req.startDate} <span className="text-stone-700">→</span> {req.endDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
