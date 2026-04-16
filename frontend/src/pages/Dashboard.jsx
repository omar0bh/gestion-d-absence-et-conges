import Calendar from "../components/Calendar";
import PageHeader from "../components/PageHeader";
import AdminDashboard from "../components/AdminDashboard";
import ValidatorDashboard from "../components/ValidatorDashboard";
import EmployeeDashboard from "../components/EmployeeDashboard";
import DashboardReportsPanel from "../components/DashboardReportsPanel";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Shield,
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();

  const isSystemAdmin = user?.role === "SYSTEM_ADMIN";

  const isValidator = [
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ].includes(user?.role);

  const canViewReports = ["DEPARTMENT_MANAGER", "HR", "DIRECTOR"].includes(
    user?.role
  );

  const roleLabel = user?.role?.replaceAll("_", " ") || "-";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <PageHeader
        title="Aperçu du tableau de bord"
        subtitle={
          isSystemAdmin
            ? "Aperçu de l'administration et de la configuration du système"
            : isValidator
              ? "Aperçu des absences pour votre équipe et impact des validations à venir"
              : "Aperçu de vos absences et demandes de congé"
        }
      />

      {/* Top Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="glass-card p-8 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
            <User size={120} />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20 shadow-inner">
              <User size={24} />
            </div>
            <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-2">
              Employé Connecté
            </h3>
            <p className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
              {user?.fullName || "-"}
            </p>
            <p className="text-stone-500 text-xs font-medium">
              Identité Vérifiée
            </p>
          </div>
        </div>

        {/* Email Card */}
        <div className="glass-card p-8 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
            <Mail size={120} />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-inner">
              <Mail size={24} />
            </div>
            <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-2">
              Contact Principal
            </h3>
            <p
              className="text-xl font-bold text-stone-200 truncate leading-none mb-2"
              title={user?.email}
            >
              {user?.email || "-"}
            </p>
            <p className="text-stone-500 text-xs font-medium italic">
              Communication Officielle
            </p>
          </div>
        </div>

        {/* Role Card */}
        <div className="glass-card p-8 group overflow-hidden relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
            <Shield size={120} />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20 shadow-inner">
              <Shield size={24} />
            </div>
            <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-2">
              Niveau d'Accès
            </h3>
            <div className="mt-1">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-stone-100/5 border border-white/10 text-stone-300 shadow-sm backdrop-blur-md">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Based Summary Cards */}
      {isSystemAdmin ? (
        <AdminDashboard />
      ) : isValidator ? (
        <ValidatorDashboard />
      ) : (
        <EmployeeDashboard />
      )}

      {canViewReports && <DashboardReportsPanel />}
    </div>
  );
}

export default Dashboard;