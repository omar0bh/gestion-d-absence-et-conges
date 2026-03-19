import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the leave management system"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-lg hover:bg-zinc-900/50 transition-colors duration-300">
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">Connected User</h3>
          <p className="text-2xl font-bold text-stone-100 drop-shadow-sm">{user?.fullName || "-"}</p>
        </div>

        <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-lg hover:bg-zinc-900/50 transition-colors duration-300">
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">Email</h3>
          <p className="text-xl font-medium text-stone-100 drop-shadow-sm truncate" title={user?.email}>{user?.email || "-"}</p>
        </div>

        <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-lg hover:bg-zinc-900/50 transition-colors duration-300">
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">Role</h3>
          <p className="text-2xl font-bold text-stone-100 drop-shadow-sm">
            <span className="inline-block bg-[#4a3b32]/80 px-3 py-1 rounded-lg border border-[#5c493d]/50 text-sm">
              {user?.role || "-"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;