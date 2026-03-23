import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800/50 shadow-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 gap-4 sm:gap-6">
          <div className="flex-shrink-0 flex items-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-stone-100 to-stone-400 bg-clip-text text-transparent">Gestion Congés</h2>
          </div>

          <div className="flex-1 overflow-x-auto hide-scrollbar py-2 sm:py-0">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2">
              <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Dashboard</Link>
              <Link to="/departments" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Departments</Link>
              <Link to="/divisions" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Divisions</Link>
              <Link to="/services" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Services</Link>
              <Link to="/employees" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Employees</Link>
              <Link to="/leave-types" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Leave Types</Link>
              <Link to="/leave-balances" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">Balances</Link>
              <Link to="/new-leave-request" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-500 hover:text-amber-400 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-900/50 transition-colors whitespace-nowrap">New Request</Link>
              <Link to="/my-leave-requests" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">My Requests</Link>
              <Link to="/requests-to-validate" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-300 hover:text-stone-50 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">To Validate</Link>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center border-l border-zinc-700/50 pl-4 sm:pl-6 ml-auto gap-4">
            {user && (
              <div className="hidden lg:flex flex-col items-end justify-center">
                <span className="text-sm font-bold text-stone-200 leading-tight">{user.fullName}</span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{user.role}</span>
              </div>
            )}
            <button 
              onClick={handleLogout} 
              className="px-4 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 hover:text-red-100 text-xs sm:text-sm font-bold rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </nav>
  );
}

export default Navbar;