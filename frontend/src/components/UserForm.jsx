import { useEffect, useState } from "react";
import api from "../api/axios";
import CustomSelect from "./CustomSelect";
import { ShieldCheck } from "lucide-react";

function UserForm({ onUserSaved, editingUser, onCancelEdit }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    active: true,
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingUser) {
      setForm({
        fullName: editingUser.fullName || "",
        email: editingUser.email || "",
        password: "",
        role: editingUser.role || "EMPLOYEE",
        active: editingUser.active ?? true,
      });
      setMessage("");
      setErrorMessage("");
    } else {
      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        active: true,
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          active: form.active,
        });
        setMessage("Utilisateur mis à jour avec succès.");
      } else {
        await api.post("/auth/register", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setMessage("Utilisateur créé avec succès.");
      }

      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        active: true,
      });

      if (onUserSaved) {
        onUserSaved();
      }

      if (editingUser && onCancelEdit) {
        onCancelEdit();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Erreur lors de l'enregistrement de l'utilisateur."
      );
    }
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">
        {editingUser ? "Modifier l'Utilisateur" : "Créer un Utilisateur"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
              Nom complet
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Entrez le nom complet"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Entrez l'e-mail"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          {!editingUser && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Entrez le mot de passe"
                required
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
              />
            </div>
          )}

          <CustomSelect
            label="Rôle"
            name="role"
            value={form.role}
            onChange={(val) => handleChange({ target: { name: "role", value: val } })}
            placeholder="Sélectionner le rôle"
            icon={ShieldCheck}
            options={["EMPLOYEE", "SERVICE_MANAGER", "DIVISION_MANAGER", "DEPARTMENT_MANAGER", "HR", "DIRECTOR", "SYSTEM_ADMIN"].map((role) => ({
              value: role,
              label: role
            }))}
          />

          {editingUser && (
            <div className="flex items-center gap-3 pt-8">
              <input
                id="active"
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 accent-amber-600"
              />
              <label htmlFor="active" className="text-sm font-medium text-stone-300">
                Utilisateur actif
              </label>
            </div>
          )}
        </div>

        {message && (
          <div className="bg-green-950/40 border border-green-800/50 text-green-300 px-4 py-3 rounded-xl text-sm font-medium text-center">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl text-sm font-medium text-center">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          {editingUser && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-200 bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-600/50 transition-colors"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
          >
            {editingUser ? "Mettre à jour" : "Créer l'Utilisateur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;