import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import CustomSelect from "./CustomSelect";
import { User, Building2, Layers, Settings2, ShieldCheck, Briefcase } from "lucide-react";

function EmployeeForm({ onEmployeeSaved, editingEmployee, onCancelEdit }) {
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

  const generateNextMatricule = (employeesList) => {
    if (!employeesList || employeesList.length === 0) return "EMP001";

    const maxNumber = employeesList.reduce((max, emp) => {
      const matricule = emp.matricule || "";
      const match = matricule.match(/^EMP(\d+)$/);
      if (!match) return max;

      const number = parseInt(match[1], 10);
      return number > max ? number : max;
    }, 0);

    return `EMP${String(maxNumber + 1).padStart(3, "0")}`;
  };

  const linkedUserIds = useMemo(() => {
    return new Set(
      employees
        .filter((emp) => !editingEmployee || emp.id !== editingEmployee.id)
        .map((emp) => emp.user?.id)
        .filter(Boolean)
    );
  }, [employees, editingEmployee]);

  const availableUsers = useMemo(() => {
    return users.filter((user) => !linkedUserIds.has(user.id));
  }, [users, linkedUserIds]);

  const availableManagers = useMemo(() => {
    return users.filter((user) =>
      ["SERVICE_MANAGER", "DIVISION_MANAGER", "DEPARTMENT_MANAGER", "HR", "DIRECTOR"].includes(user.role)
    );
  }, [users]);

  const selectedUser = useMemo(() => {
    return users.find((u) => String(u.id) === String(form.userId));
  }, [users, form.userId]);

  const isTopLevelRole =
    selectedUser?.role === "DIRECTOR" || selectedUser?.role === "SYSTEM_ADMIN";

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

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        matricule: editingEmployee.matricule || "",
        userId: editingEmployee.user?.id ? String(editingEmployee.user.id) : "",
        departmentId: editingEmployee.department?.id ? String(editingEmployee.department.id) : "",
        divisionId: editingEmployee.division?.id ? String(editingEmployee.division.id) : "",
        serviceId: editingEmployee.service?.id ? String(editingEmployee.service.id) : "",
        directManagerId: editingEmployee.directManager?.id ? String(editingEmployee.directManager.id) : "",
        positionTitle: editingEmployee.positionTitle || "",
        hireDate: editingEmployee.hireDate || "",
      });
      setMessage("");
      setErrorMessage("");
    } else if (employees.length >= 0) {
      setForm((prev) => ({
        ...prev,
        matricule: generateNextMatricule(employees),
      }));
    }
  }, [editingEmployee, employees]);

  useEffect(() => {
    if (isTopLevelRole) {
      setForm((prev) => ({
        ...prev,
        departmentId: "",
        divisionId: "",
        serviceId: "",
        directManagerId: "",
      }));
    }
  }, [isTopLevelRole]);

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

  const resetForm = () => {
    setForm({
      matricule: generateNextMatricule(employees),
      userId: "",
      departmentId: "",
      divisionId: "",
      serviceId: "",
      directManagerId: "",
      positionTitle: "",
      hireDate: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      if (!isTopLevelRole && !form.departmentId) {
        setErrorMessage("Le département est requis pour ce rôle.");
        return;
      }

      const payload = {
        matricule: form.matricule,
        userId: Number(form.userId),
        departmentId: isTopLevelRole ? null : (form.departmentId ? Number(form.departmentId) : null),
        divisionId: isTopLevelRole ? null : (form.divisionId ? Number(form.divisionId) : null),
        serviceId: isTopLevelRole ? null : (form.serviceId ? Number(form.serviceId) : null),
        directManagerId: isTopLevelRole ? null : (form.directManagerId ? Number(form.directManagerId) : null),
        positionTitle: form.positionTitle,
        hireDate: form.hireDate,
      };

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, payload);
        setMessage("Employé mis à jour avec succès.");
      } else {
        await api.post("/employees", payload);
        setMessage("Employé créé avec succès.");
      }

      resetForm();
      fetchData();

      if (onEmployeeSaved) {
        onEmployeeSaved();
      }

      if (editingEmployee && onCancelEdit) {
        onCancelEdit();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Erreur lors de l'enregistrement de l'employé."
      );
    }
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-stone-100 mb-6 drop-shadow-sm">
        {editingEmployee ? "Modifier l'Employé" : "Créer un Employé"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
              Matricule
            </label>
            <input
              type="text"
              name="matricule"
              value={form.matricule}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <CustomSelect
            label="Utilisateur"
            name="userId"
            value={form.userId}
            onChange={(val) => handleChange({ target: { name: "userId", value: val } })}
            placeholder="Sélectionner l'utilisateur"
            icon={User}
            options={availableUsers
              .concat(editingEmployee?.user ? [editingEmployee.user] : [])
              .filter((value, index, self) => self.findIndex((v) => v.id === value.id) === index)
              .map((user) => ({
                value: String(user.id),
                label: `${user.fullName} - ${user.role}`
              }))
            }
          />

          <CustomSelect
            label="Département"
            name="departmentId"
            value={form.departmentId}
            onChange={(val) => handleChange({ target: { name: "departmentId", value: val } })}
            placeholder="Sélectionner le département"
            icon={Building2}
            disabled={isTopLevelRole}
            options={departments.map((d) => ({ value: String(d.id), label: d.name }))}
          />

          <CustomSelect
            label="Division"
            name="divisionId"
            value={form.divisionId}
            onChange={(val) => handleChange({ target: { name: "divisionId", value: val } })}
            placeholder="Sélectionner la division"
            icon={Layers}
            disabled={!form.departmentId || isTopLevelRole}
            options={filteredDivisions.map((d) => ({ value: String(d.id), label: d.name }))}
          />

          <CustomSelect
            label="Service"
            name="serviceId"
            value={form.serviceId}
            onChange={(val) => handleChange({ target: { name: "serviceId", value: val } })}
            placeholder="Sélectionner le service"
            icon={Settings2}
            disabled={!form.divisionId || isTopLevelRole}
            options={filteredServices.map((s) => ({ value: String(s.id), label: s.name }))}
          />

          <CustomSelect
            label="Responsable Direct"
            name="directManagerId"
            value={form.directManagerId}
            onChange={(val) => handleChange({ target: { name: "directManagerId", value: val } })}
            placeholder="Sélectionner le responsable"
            icon={ShieldCheck}
            disabled={isTopLevelRole}
            options={availableManagers
              .filter((manager) => String(manager.id) !== String(form.userId))
              .map((m) => ({
                value: String(m.id),
                label: `${m.fullName} - ${m.role}`
              }))
            }
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
              Titre du Poste
            </label>
            <input
              type="text"
              name="positionTitle"
              value={form.positionTitle}
              onChange={handleChange}
              placeholder="Entrez le titre du poste"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 placeholder-stone-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
              Date d'embauche
            </label>
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

        <div className="flex justify-end gap-3">
          {editingEmployee && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setMessage("");
                setErrorMessage("");
                onCancelEdit?.();
              }}
              className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-200 bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-600/50 transition-colors"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            className="w-full md:w-auto py-3 px-8 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#4a3b32] transition-colors"
          >
            {editingEmployee ? "Mettre à jour" : "Créer l'Employé"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;