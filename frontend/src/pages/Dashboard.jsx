import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Award } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back to your employee portal"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="glass-card p-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <User size={80} />
          </div>
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20">
              <User size={24} />
            </div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Connected Employee</h3>
            <p className="text-2xl font-bold text-white tracking-tight">{user?.fullName || "-"}</p>
          </div>
        </div>

        {/* Email Card */}
        <div className="glass-card p-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mail size={80} />
          </div>
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
              <Mail size={24} />
            </div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Primary Contact</h3>
            <p className="text-xl font-semibold text-stone-200 truncate" title={user?.email}>{user?.email || "-"}</p>
          </div>
        </div>

        {/* Role Card */}
        <div className="glass-card p-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={80} />
          </div>
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
              <Shield size={24} />
            </div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Access Level</h3>
            <div className="mt-1">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-stone-100/5 border border-white/10 text-stone-300">
                {user?.role?.replace("_", " ") || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
          <Award size={40} />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Leave Management System</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Use the navigation menu on the right to manage your leave requests, check your balances, or administer the system if you have the required permissions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;