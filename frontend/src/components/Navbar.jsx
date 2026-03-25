import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import logo from "../assets/logo1png.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <Link to="/dashboard" className="flex items-center group">
          <div className="relative">
            <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src={logo} 
              alt="Logo" 
              className="relative h-10 w-auto object-contain drop-shadow-md brightness-110"
            />
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-4 hidden sm:block"></div>
          <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
            Portal <span className="text-amber-400 font-medium">Congés</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-white">{user.fullName}</span>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
              {user.role?.replace("_", " ")}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-stone-300 hover:text-white">
              <User size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 transition-all duration-300 flex items-center gap-2 text-sm font-medium border border-white/5 hover:border-red-500/30"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;