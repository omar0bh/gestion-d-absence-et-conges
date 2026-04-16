import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Settings2, 
  Users, 
  FileText, 
  Wallet, 
  PlusCircle, 
  Clock, 
  CheckSquare,
  ShieldCheck,
  Briefcase
} from "lucide-react";

function RightSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role = user.role;
  const isSystemAdmin = role === "SYSTEM_ADMIN";
  const isValidator = [
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ].includes(role);

  const isOrgUser = [
    "EMPLOYEE",
    "SERVICE_MANAGER",
    "DIVISION_MANAGER",
    "DEPARTMENT_MANAGER",
    "HR",
    "DIRECTOR",
  ].includes(role);

  const navItems = [
    { label: "Tableau de bord", path: "/dashboard", icon: LayoutDashboard, show: isOrgUser || isSystemAdmin },
    { label: "Départements", path: "/departments", icon: Building2, show: isOrgUser },
    { label: "Divisions", path: "/divisions", icon: Layers, show: isOrgUser },
    { label: "Services", path: "/services", icon: Settings2, show: isOrgUser },
    { label: "Employés", path: "/employees", icon: Users, show: isOrgUser },
    { label: "Types de congé", path: "/leave-types", icon: FileText, show: isOrgUser },
    { label: "Soldes", path: "/leave-balances", icon: Wallet, show: isOrgUser },
    { label: "Nouvelle demande", path: "/new-leave-request", icon: PlusCircle, show: isOrgUser },
    { label: "Mes demandes", path: "/my-leave-requests", icon: Clock, show: isOrgUser },
    { label: "À valider", path: "/requests-to-validate", icon: CheckSquare, show: isValidator },
  ];

  const adminItems = [
    { label: "Gestion Utilisateurs", path: "/users-management", icon: ShieldCheck, show: isSystemAdmin },
    { label: "Gestion Employés", path: "/employees-management", icon: Users, show: isSystemAdmin },
    { label: "Gestion Types Congé", path: "/leave-types-management", icon: FileText, show: isSystemAdmin },
    { label: "Gestion Soldes", path: "/balances-management", icon: Wallet, show: isSystemAdmin },
    { label: "Gestion Dépts", path: "/departments-management", icon: Building2, show: isSystemAdmin },
    { label: "Gestion Divisions", path: "/divisions-management", icon: Layers, show: isSystemAdmin },
    { label: "Gestion Services", path: "/services-management", icon: Settings2, show: isSystemAdmin },
  ];

  return (
    <aside className="fixed top-16 right-0 bottom-0 w-64 glass-sidebar p-4 flex flex-col gap-6 overflow-y-auto z-40">
      <div className="flex flex-col gap-1">
        <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-2">
          Navigation
        </h3>
        {navItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {isSystemAdmin && (
        <div className="flex flex-col gap-1">
          <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-2">
            Administration
          </h3>
          {adminItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}


    </aside>
  );
}

export default RightSidebar;
