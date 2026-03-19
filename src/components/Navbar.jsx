import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo1png.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-700/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Gestion Congés Logo" 
                className="w-[140px] h-auto object-contain drop-shadow-md"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 md:ml-6">
            <Link to="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:text-white hover:bg-zinc-800/50 transition-colors">Dashboard</Link>
            <Link to="/departments" className="px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:text-white hover:bg-zinc-800/50 transition-colors">Departments</Link>
            <Link to="/divisions" className="px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:text-white hover:bg-zinc-800/50 transition-colors">Divisions</Link>
            <Link to="/services" className="px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:text-white hover:bg-zinc-800/50 transition-colors">Services</Link>
            <Link to="/employees" className="px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:text-white hover:bg-zinc-800/50 transition-colors">Employees</Link>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-stone-100">{user.fullName}</span>
                <small className="text-xs text-stone-400">{user.role}</small>
              </div>
            )}
            <button 
              onClick={handleLogout} 
              className="ml-2 bg-[#4a3b32]/80 hover:bg-[#3d312a] border border-[#5c493d]/50 text-stone-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;