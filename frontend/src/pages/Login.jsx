import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo1png.png";

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative">

      {/* Fixed Logo Top Left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
        <img
          src={logo}
          alt="Logo"
          className="h-14 w-auto object-contain drop-shadow-md"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Glass Form Container - Dark Brown/Grey Transparent */}
        <div className="px-10 py-12 bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 shadow-2xl rounded-3xl">

          <div className="text-center mb-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-stone-100 drop-shadow-md mb-2">Portail de Connexion</h1>
            <p className="text-sm font-medium text-stone-300">
              Accédez au système de gestion des congés
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
                Adresse E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="Entrez votre e-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-950/50 border border-red-900/50 text-red-200 px-4 py-3 rounded-xl text-sm font-medium text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
            >
              {loading ? "Authentification..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;