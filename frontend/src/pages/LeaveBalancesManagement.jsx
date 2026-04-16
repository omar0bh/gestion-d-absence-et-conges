import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";
import CustomSelect from "../components/CustomSelect";
import { User, Briefcase } from "lucide-react";

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
      
      setMessage("Solde créé avec succès !");
      setForm({
        employeeId: "",
        leaveTypeId: "",
        year: new Date().getFullYear(),
        remainingDays: ""
      });
      fetchData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erreur lors de la création du solde.");
    }
  };

  const columns = [
    { 
      key: "employee", 
      label: "Employé", 
      render: (row) => (
        <span className="font-semibold text-stone-100">
          {row.employee?.user?.fullName || "Inconnu"}
        </span>
      ) 
    },
    { 
      key: "leaveType", 
      label: "Type de congé", 
      render: (row) => row.leaveType?.name || "-" 
    },
    { key: "year", label: "Année" },
    { 
      key: "remainingDays", 
      label: "Restant",
      render: (row) => (
        <span className="font-bold text-amber-500">{row.remainingDays}</span>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader 
        title="Soldes de Congé" 
        subtitle="Gérer les quotas de congé des employés et les soldes annuels" 
      />

      {/* FORM CARD */}
      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Attribuer un Solde</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <CustomSelect
              label="Employé"
              name="employeeId"
              value={form.employeeId}
              onChange={(val) => handleChange({ target: { name: "employeeId", value: val } })}
              placeholder="Sélectionner l'Employé"
              icon={User}
              options={employees.map((e) => ({
                value: String(e.id),
                label: e.user?.fullName
              }))}
            />

            <CustomSelect
              label="Type de congé"
              name="leaveTypeId"
              value={form.leaveTypeId}
              onChange={(val) => handleChange({ target: { name: "leaveTypeId", value: val } })}
              placeholder="Sélectionner le Type de congé"
              icon={Briefcase}
              options={leaveTypes.map((l) => ({
                value: String(l.id),
                label: l.name
              }))}
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Année</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Année"
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Jours Restants</label>
              <input
                type="number"
                name="remainingDays"
                value={form.remainingDays}
                onChange={handleChange}
                placeholder="Jours Restants"
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
              Créer le Solde
            </button>
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Soldes Actuels</h3>
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