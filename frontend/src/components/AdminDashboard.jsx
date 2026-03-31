import { Link } from "react-router-dom";
import { Settings, Users, Briefcase, CalendarDays, ExternalLink } from "lucide-react";

function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 group overflow-hidden relative border-l-4 border-fuchsia-500/50">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <Settings size={110} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-5 border border-fuchsia-500/20 shadow-inner">
              <Settings size={22} />
            </div>
            <p className="text-xl font-bold text-white leading-none mb-2">Admin</p>
            <p className="text-stone-500 text-xs font-medium">System configuration and management</p>
          </div>
        </div>

        <div className="glass-card p-6 group overflow-hidden relative border-l-4 border-cyan-500/50">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <Users size={110} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 border border-cyan-500/20 shadow-inner">
              <Users size={22} />
            </div>
            <p className="text-xl font-bold text-white leading-none mb-2">Users</p>
            <p className="text-stone-500 text-xs font-medium">Create and manage accounts</p>
          </div>
        </div>

        <div className="glass-card p-6 group overflow-hidden relative border-l-4 border-amber-500/50">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <Briefcase size={110} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-5 border border-amber-500/20 shadow-inner">
              <Briefcase size={22} />
            </div>
            <p className="text-xl font-bold text-white leading-none mb-2">Employees</p>
            <p className="text-stone-500 text-xs font-medium">Link users to employee profiles</p>
          </div>
        </div>

        <div className="glass-card p-6 group overflow-hidden relative border-l-4 border-emerald-500/50">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
            <CalendarDays size={110} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 border border-emerald-500/20 shadow-inner">
              <CalendarDays size={22} />
            </div>
            <p className="text-xl font-bold text-white leading-none mb-2">Balances</p>
            <p className="text-stone-500 text-xs font-medium">Manage leave balances and types</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link to="/users-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Users Management</div>
          </Link>
          <Link to="/employees-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Employees Management</div>
          </Link>
          <Link to="/leave-types-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Leave Types Management</div>
          </Link>
          <Link to="/balances-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Balances Management</div>
          </Link>
          <Link to="/departments-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Departments Management</div>
          </Link>
          <Link to="/divisions-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Divisions Management</div>
          </Link>
          <Link to="/services-management" className="glass-card p-4 hover:bg-white/5 transition-colors group flex items-start gap-4 border border-white/5 hover:border-white/20">
            <div className="w-8 h-8 rounded-lg bg-stone-500/20 flex items-center justify-center text-stone-400 border border-stone-500/20 group-hover:scale-110 transition-transform"><ExternalLink size={16} /></div>
            <div className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors mt-1">Services Management</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;