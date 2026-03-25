import { useState } from "react";
import api from "../api/axios";

function LeaveTypeForm({ onLeaveTypeCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    maxDays: "",
    requiresProof: false,
    requiresDirectorApproval: false,
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/leave-types", {
        name: form.name,
        description: form.description,
        maxDays: Number(form.maxDays),
        requiresProof: form.requiresProof,
        requiresDirectorApproval: form.requiresDirectorApproval,
      });

      setMessage("Leave type created successfully.");

      setForm({
        name: "",
        description: "",
        maxDays: "",
        requiresProof: false,
        requiresDirectorApproval: false,
      });

      if (onLeaveTypeCreated) {
        onLeaveTypeCreated();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Error creating leave type."
      );
    }
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Create Leave Type</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter leave type name"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Max Days</label>
            <input
              type="number"
              name="maxDays"
              value={form.maxDays}
              onChange={handleChange}
              placeholder="Enter max days"
              required
              min="1"
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Description</label>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-8 items-center py-2 px-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="requiresProof"
              checked={form.requiresProof}
              onChange={handleChange}
              className="w-5 h-5 rounded-md border-zinc-600 bg-zinc-900 text-amber-600 focus:ring-amber-700 focus:ring-offset-zinc-900 accent-amber-600 transition-all"
            />
            <span className="text-sm font-medium text-stone-300 group-hover:text-stone-100 transition-colors">Requires Proof</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="requiresDirectorApproval"
              checked={form.requiresDirectorApproval}
              onChange={handleChange}
              className="w-5 h-5 rounded-md border-zinc-600 bg-zinc-900 text-amber-600 focus:ring-amber-700 focus:ring-offset-zinc-900 accent-amber-600 transition-all"
            />
            <span className="text-sm font-medium text-stone-300 group-hover:text-stone-100 transition-colors">Requires Director Approval</span>
          </label>
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
          >
            Create Leave Type
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeaveTypeForm;