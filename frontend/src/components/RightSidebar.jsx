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
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, show: isOrgUser || isSystemAdmin },
    { label: "Departments", path: "/departments", icon: Building2, show: isOrgUser },
    { label: "Divisions", path: "/divisions", icon: Layers, show: isOrgUser },
    { label: "Services", path: "/services", icon: Settings2, show: isOrgUser },
    { label: "Employees", path: "/employees", icon: Users, show: isOrgUser },
    { label: "Leave Types", path: "/leave-types", icon: FileText, show: isOrgUser },
    { label: "Balances", path: "/leave-balances", icon: Wallet, show: isOrgUser },
    { label: "New Request", path: "/new-leave-request", icon: PlusCircle, show: isOrgUser },
    { label: "My Requests", path: "/my-leave-requests", icon: Clock, show: isOrgUser },
    { label: "To Validate", path: "/requests-to-validate", icon: CheckSquare, show: isValidator },
  ];

  const adminItems = [
    { label: "Users Admin", path: "/users-management", icon: ShieldCheck, show: isSystemAdmin },
    { label: "Employees Admin", path: "/employees-management", icon: Users, show: isSystemAdmin },
    { label: "Leave Types Admin", path: "/leave-types-management", icon: FileText, show: isSystemAdmin },
    { label: "Balances Admin", path: "/balances-management", icon: Wallet, show: isSystemAdmin },
    { label: "Depts Management", path: "/departments-management", icon: Building2, show: isSystemAdmin },
    { label: "Divisions Admin", path: "/divisions-management", icon: Layers, show: isSystemAdmin },
    { label: "Services Admin", path: "/services-management", icon: Settings2, show: isSystemAdmin },
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

      <div className="mt-auto p-4 glass-card rounded-xl border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-3 mb-2 text-amber-400">
          <Briefcase size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Help Center</span>
        </div>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          Need help managing your leaves or have a technical issue? Contact support.
        </p>
      </div>
    </aside>
  );
}

export default RightSidebar;
