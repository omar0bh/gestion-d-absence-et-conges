import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import CustomSelect from "./CustomSelect";
import { Layers, ShieldCheck } from "lucide-react";

function ServiceForm({ onServiceCreated }) {
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    divisionId: "",
    managerUserId: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const [divisionsRes, usersRes] = await Promise.all([
        api.get("/divisions"),
        api.get("/users"),
      ]);

      setDivisions(divisionsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error("Error loading services form data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // managers الممكنين
  const availableManagers = useMemo(() => {
    return users.filter((user) =>
      ["SERVICE_MANAGER", "DIVISION_MANAGER", "DEPARTMENT_MANAGER", "HR", "DIRECTOR", "SYSTEM_ADMIN"].includes(user.role)
    );
  }, [users]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/services", {
        name: form.name,
        divisionId: Number(form.divisionId),
        managerUserId: Number(form.managerUserId),
      });

      setMessage("Service créé avec succès.");

      setForm({
        name: "",
        divisionId: "",
        managerUserId: "",
      });

      if (onServiceCreated) {
        onServiceCreated();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response.data : "") ||
        "Error creating service."
      );
    }
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Créer un Service</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Nom du Service</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Entrez le nom du service"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <CustomSelect
            label="Division"
            name="divisionId"
            value={form.divisionId}
            onChange={(val) => handleChange({ target: { name: "divisionId", value: val } })}
            placeholder="Sélectionner la division"
            icon={Layers}
            options={divisions.map((d) => ({
              value: String(d.id),
              label: d.name
            }))}
          />

          <CustomSelect
            label="Responsable"
            name="managerUserId"
            value={form.managerUserId}
            onChange={(val) => handleChange({ target: { name: "managerUserId", value: val } })}
            placeholder="Sélectionner le responsable"
            icon={ShieldCheck}
            options={availableManagers.map((user) => ({
              value: String(user.id),
              label: `${user.fullName} - ${user.role}`
            }))}
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

        <div className="flex justify-end mt-2">
          <button 
            type="submit" 
            className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
          >
            Créer le Service
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;