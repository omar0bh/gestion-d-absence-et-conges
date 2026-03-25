import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

function DivisionForm({ onDivisionCreated }) {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    departmentId: "",
    managerUserId: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const [departmentsRes, usersRes] = await Promise.all([
        api.get("/departments"),
        api.get("/users"),
      ]);

      setDepartments(departmentsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error("Error loading division form data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableManagers = useMemo(() => {
    return users.filter((user) =>
      ["DIVISION_MANAGER", "DEPARTMENT_MANAGER", "HR", "DIRECTOR", "SYSTEM_ADMIN"].includes(user.role)
    );
  }, [users]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/divisions", {
        name: form.name,
        departmentId: Number(form.departmentId),
        managerUserId: Number(form.managerUserId),
      });

      setMessage("Division created successfully.");

      setForm({
        name: "",
        departmentId: "",
        managerUserId: "",
      });

      if (onDivisionCreated) {
        onDivisionCreated();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Error creating division."
      );
    }
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Create Division</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Division Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter division name"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Department</label>
            <div className="relative">
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id} className="bg-zinc-900 text-stone-100">
                    {department.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Manager</label>
            <div className="relative">
              <select
                name="managerUserId"
                value={form.managerUserId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select manager</option>
                {availableManagers.map((user) => (
                  <option key={user.id} value={user.id} className="bg-zinc-900 text-stone-100">
                    {user.fullName} - {user.role}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
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

        <div className="flex justify-end mt-2">
          <button 
            type="submit" 
            className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
          >
            Create Division
          </button>
        </div>
      </form>
    </div>
  );
}

export default DivisionForm;