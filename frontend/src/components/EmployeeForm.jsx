import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

function EmployeeForm({ onEmployeeCreated }) {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    matricule: "",
    userId: "",
    departmentId: "",
    divisionId: "",
    serviceId: "",
    directManagerId: "",
    positionTitle: "",
    hireDate: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, employeesRes, departmentsRes, divisionsRes, servicesRes] =
        await Promise.all([
          api.get("/users"),
          api.get("/employees"),
          api.get("/departments"),
          api.get("/divisions"),
          api.get("/services"),
        ]);

      setUsers(usersRes.data || []);
      setEmployees(employeesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setDivisions(divisionsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error("Error loading employee form data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const linkedUserIds = useMemo(() => {
    return new Set(employees.map((emp) => emp.user?.id).filter(Boolean));
  }, [employees]);

  const availableUsers = useMemo(() => {
    return users.filter((user) => !linkedUserIds.has(user.id));
  }, [users, linkedUserIds]);

  const availableManagers = useMemo(() => {
    return users.filter((user) =>
      ["SERVICE_MANAGER", "DIVISION_MANAGER", "DEPARTMENT_MANAGER", "HR", "DIRECTOR"].includes(user.role)
    );
  }, [users]);

  const filteredDivisions = useMemo(() => {
    if (!form.departmentId) return divisions;
    return divisions.filter(
      (division) => String(division.department?.id) === String(form.departmentId)
    );
  }, [divisions, form.departmentId]);

  const filteredServices = useMemo(() => {
    if (!form.divisionId) return services;
    return services.filter(
      (service) => String(service.division?.id) === String(form.divisionId)
    );
  }, [services, form.divisionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "departmentId") {
        updated.divisionId = "";
        updated.serviceId = "";
      }

      if (name === "divisionId") {
        updated.serviceId = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/employees", {
        matricule: form.matricule,
        userId: Number(form.userId),
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        divisionId: form.divisionId ? Number(form.divisionId) : null,
        serviceId: form.serviceId ? Number(form.serviceId) : null,
        directManagerId: form.directManagerId ? Number(form.directManagerId) : null,
        positionTitle: form.positionTitle,
        hireDate: form.hireDate,
      });

      setMessage("Employee created successfully.");

      setForm({
        matricule: "",
        userId: "",
        departmentId: "",
        divisionId: "",
        serviceId: "",
        directManagerId: "",
        positionTitle: "",
        hireDate: "",
      });

      fetchData();

      if (onEmployeeCreated) {
        onEmployeeCreated();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response.data : "") ||
        "Error creating employee."
      );
    }
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">Create Employee</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Matricule</label>
            <input
              type="text"
              name="matricule"
              value={form.matricule}
              onChange={handleChange}
              placeholder="Enter matricule"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">User</label>
            <div className="relative">
              <select
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select user</option>
                {availableUsers.map((user) => (
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
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Division</label>
            <div className="relative">
              <select
                name="divisionId"
                value={form.divisionId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none disabled:opacity-50"
                disabled={!form.departmentId}
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select division</option>
                {filteredDivisions.map((division) => (
                  <option key={division.id} value={division.id} className="bg-zinc-900 text-stone-100">
                    {division.name}
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
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Service</label>
            <div className="relative">
              <select
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none disabled:opacity-50"
                disabled={!form.divisionId}
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select service</option>
                {filteredServices.map((service) => (
                  <option key={service.id} value={service.id} className="bg-zinc-900 text-stone-100">
                    {service.name}
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
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Direct Manager</label>
            <div className="relative">
              <select
                name="directManagerId"
                value={form.directManagerId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner appearance-none"
              >
                <option value="" className="bg-zinc-900 text-stone-400">Select direct manager</option>
                {availableManagers.map((manager) => (
                  <option key={manager.id} value={manager.id} className="bg-zinc-900 text-stone-100">
                    {manager.fullName} - {manager.role}
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
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={form.positionTitle}
              onChange={handleChange}
              placeholder="Enter position title"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">Hire Date</label>
            <input
              type="date"
              name="hireDate"
              value={form.hireDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner [color-scheme:dark]"
            />
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
          >
            Create Employee
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;