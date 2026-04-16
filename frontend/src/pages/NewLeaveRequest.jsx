import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import CustomSelect from "../components/CustomSelect";
import { Briefcase } from "lucide-react";

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

      setMessage("Demande de congé soumise avec succès.");
      setFormData({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Échec de la soumission de la demande de congé."
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Nouvelle demande de congé"
        subtitle="Soumettre une nouvelle demande de congé ou d'absence"
      />

      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Détails de la demande
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CustomSelect
            label="Type de congé"
            name="leaveTypeId"
            value={formData.leaveTypeId}
            onChange={(val) => handleChange({ target: { name: "leaveTypeId", value: val } })}
            placeholder="Sélectionner le type de congé"
            icon={Briefcase}
            options={leaveTypes.map((type) => ({
              value: String(type.id),
              label: type.name
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Date de début</label>
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
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Date de fin</label>
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
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Motif / Description</label>
            <textarea
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Indiquez un motif pour votre demande..."
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
              Soumettre la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLeaveRequest;