import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

function NewLeaveRequest() {
  const { employeeId } = useAuth();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await api.get("/leave-types");
        setLeaveTypes(response.data);
      } catch (error) {
        console.error("Error loading leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/leave-requests", {
        employeeId: Number(employeeId),
        leaveTypeId: Number(formData.leaveTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      setMessage("Leave request submitted successfully.");
      setFormData({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to submit leave request."
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="New Leave Request"
        subtitle="Submit a new request for leave or absence"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Request Details
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Leave Type</label>
            <div className="relative">
              <select
                name="leaveTypeId"
                value={formData.leaveTypeId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id} className="bg-zinc-900 text-stone-100">
                    {type.name}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Reason / Description</label>
            <textarea
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Provide a reason for your request..."
              required
              className="resize-none w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
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

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="w-full sm:w-auto py-3.5 px-10 rounded-xl shadow-lg text-sm font-extrabold text-stone-50 bg-[#4a3b32] hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-amber-700/50 transition-all"
            >
              Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLeaveRequest;